const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const CourseStats = require('../models/CourseStats');

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

exports.getCourseStats = async (req, res) => {
  try {
    const { subject, increment } = req.query;
    if (!subject) return res.status(400).json({ message: "Thiếu tham số subject" });
    
    let stats = await CourseStats.findOne({ courseType: subject });
    if (!stats) {
      stats = new CourseStats({ courseType: subject });
      await stats.save();
    }

    if (increment === 'true') {
      stats.viewCount += 1;
      await stats.save();
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGlobalStats = async (req, res) => {
  try {
    const allStats = await CourseStats.find({});
    let totalViews = 0;
    let totalSubmits = 0;
    
    allStats.forEach(stat => {
      totalViews += stat.viewCount;
      totalSubmits += stat.submitCount;
    });

    // Áp dụng Số Phong Thủy làm Offset
    totalViews += 3979;
    totalSubmits += 1368;

    res.json({ totalViews, totalSubmits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStats = async (req, res) => {
  try {
    const adminPass = req.headers['x-admin-password'];
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ message: "Không có quyền truy cập. Sai mật khẩu Admin!" });
    }

    const allStats = await CourseStats.find({});
    res.json(allStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHardcoreQuiz = async (req, res) => {
  try {
    const { subject, limit = 60 } = req.query;
    if (!subject) return res.status(400).json({ message: "Thiếu tham số subject (A, B, ACCESS)" });
    
    const totalCount = parseInt(limit);
    const hardCount = Math.floor(totalCount * 0.6);
    const mediumCount = Math.floor(totalCount * 0.3);

    // Hard: failedAttempts / totalAttempts > 0.5
    const hardQuestions = await Question.aggregate([
      { $match: { 
          courseType: subject, 
          totalAttempts: { $gt: 0 }, 
          $expr: { $gt: [{ $divide: ["$failedAttempts", "$totalAttempts"] }, 0.5] } 
      } },
      { $sample: { size: hardCount } }
    ]);

    // Medium: failedAttempts / totalAttempts between 0.2 and 0.5
    const mediumQuestions = await Question.aggregate([
      { $match: { 
          courseType: subject, 
          totalAttempts: { $gt: 0 }, 
          $expr: { 
            $and: [
              { $lte: [{ $divide: ["$failedAttempts", "$totalAttempts"] }, 0.5] },
              { $gte: [{ $divide: ["$failedAttempts", "$totalAttempts"] }, 0.2] }
            ]
          } 
      } },
      { $sample: { size: mediumCount } }
    ]);

    const pickedIds = [...hardQuestions, ...mediumQuestions].map(q => q._id);

    // Dễ hoặc chưa ai làm
    const easyQuestions = await Question.aggregate([
      { $match: { 
          courseType: subject, 
          _id: { $nin: pickedIds }
      } },
      { $sample: { size: totalCount - pickedIds.length } } 
    ]);

    let finalQuestions = [...hardQuestions, ...mediumQuestions, ...easyQuestions];

    // Trộn ngẫu nhiên lại mảng
    finalQuestions = finalQuestions.sort(() => Math.random() - 0.5);
    finalQuestions = finalQuestions.slice(0, totalCount);

    const safeQuestions = finalQuestions.map(q => {
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

    // Telemetry: Cập nhật totalAttempts và failedAttempts chạy ngầm
    const finalResults = isOvertime ? overtimeData.results : onTimeData.results;
    const bulkOps = [];
    for (const qId in finalResults) {
      bulkOps.push({
        updateOne: {
          filter: { _id: qId },
          update: { 
            $inc: { 
              totalAttempts: 1, 
              failedAttempts: finalResults[qId].isCorrect ? 0 : 1 
            } 
          }
        }
      });
    }
    if (bulkOps.length > 0) {
      Question.bulkWrite(bulkOps).catch(err => console.error("Telemetry Error:", err));
    }

    // Đếm lượt thi
    CourseStats.findOneAndUpdate(
      { courseType: subject },
      { $inc: { submitCount: 1 } },
      { upsert: true, new: true }
    ).catch(err => console.error("Stats Error:", err));

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
