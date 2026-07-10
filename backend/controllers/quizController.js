const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

exports.getRandomQuiz = async (req, res) => {
  try {
    const { subject, limit = 50 } = req.query;
    if (!subject) return res.status(400).json({ message: "Thiếu tham số subject (A, B, ACCESS)" });
    
    // Lấy ngẫu nhiên câu hỏi
    const questions = await Question.aggregate([
      { $match: { courseType: subject } },
      { $sample: { size: parseInt(limit) } }
    ]);
    
    // Lọc bỏ correctAnswers và explanation để client không ăn gian được
    const safeQuestions = questions.map(q => {
      const isMultipleChoice = q.correctAnswers && q.correctAnswers.length > 1;
      const { correctAnswers, explanation, ...safeQ } = q;
      return { ...safeQ, isMultipleChoice };
    });

    res.json(safeQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ message: "Thiếu tham số subject" });
    
    const exams = await Question.distinct('examId', { courseType: subject, examId: { $ne: null } });
    
    // Sort "Đề 1", "Đề 2" numerically
    exams.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/) || [0]);
      const numB = parseInt(b.match(/\d+/) || [0]);
      return numA - numB;
    });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamByExamId = async (req, res) => {
  try {
    const { subject, examId } = req.query;
    if (!subject || !examId) return res.status(400).json({ message: "Thiếu tham số subject hoặc examId" });
    
    const questions = await Question.find({ courseType: subject, examId });
    
    const safeQuestions = questions.map(q => {
      const isMultipleChoice = q.correctAnswers && q.correctAnswers.length > 1;
      const { correctAnswers, explanation, ...safeQ } = q.toObject(); // Need toObject for mongoose document
      return { ...safeQ, isMultipleChoice };
    });

    res.json(safeQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, overtimeAnswers, questionIds, timeTaken, isOvertime, subject } = req.body;
    
    const totalQuestions = subject === 'A' ? 60 : 50;

    let allIds = [];
    if (questionIds && Array.isArray(questionIds)) {
      allIds = questionIds;
    } else {
      allIds = Array.from(new Set([...Object.keys(answers || {}), ...Object.keys(overtimeAnswers || {})]));
    }
    
    const questions = await Question.find({ _id: { $in: allIds } });
    
    const questionMap = {};
    questions.forEach(q => questionMap[q._id.toString()] = q);
    
    const sortedQuestions = [];
    if (questionIds && Array.isArray(questionIds)) {
      questionIds.forEach(id => {
        if (questionMap[id]) sortedQuestions.push(questionMap[id]);
      });
    } else {
      sortedQuestions.push(...questions);
    }
    
    const grade = (ansMap) => {
      let correct = 0;
      const resMap = {};
      sortedQuestions.forEach(q => {
        const userAns = ansMap[q._id.toString()] || [];
        const isCorrect = userAns.length > 0 && JSON.stringify(userAns.sort()) === JSON.stringify(q.correctAnswers.sort());
        if (isCorrect) correct++;
        resMap[q._id] = {
          questionText: q.text,
          options: q.options,
          isCorrect,
          correctAnswers: q.correctAnswers,
          userAnswers: userAns,
          explanation: q.explanation
        };
      });
      const score = totalQuestions > 0 ? parseFloat(((correct / totalQuestions) * 10).toFixed(1)) : 0;
      return { score, correctCount: correct, results: resMap };
    };

    const onTimeData = grade(answers || {});
    let overtimeData = null;
    
    if (isOvertime && overtimeAnswers) {
      overtimeData = grade(overtimeAnswers);
    }

    res.json({
      score: onTimeData.score,
      correctCount: onTimeData.correctCount,
      totalQuestions,
      results: isOvertime ? overtimeData.results : onTimeData.results,
      overtimeScore: overtimeData ? overtimeData.score : null,
      overtimeCorrectCount: overtimeData ? overtimeData.correctCount : null,
      timeTaken,
      isOvertime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
