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
      const { correctAnswers, explanation, ...safeQ } = q;
      return safeQ;
    });

    res.json(safeQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    // Client gửi lên mảng answers map theo id câu hỏi
    // Ví dụ: { answers: { "64abcd...": ["A. ..."], "64abce...": ["B. ..."] }, timeTaken: 1200, isOvertime: true }
    const { answers, timeTaken, isOvertime } = req.body;
    
    const questionIds = Object.keys(answers || {});
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let correctCount = 0;
    const results = {};

    questions.forEach(q => {
      const userAns = answers[q._id.toString()] || [];
      // So sánh 2 mảng (sắp xếp trước để chuẩn)
      const isCorrect = JSON.stringify(userAns.sort()) === JSON.stringify(q.correctAnswers.sort());
      if (isCorrect) correctCount++;
      
      results[q._id] = {
        questionText: q.text,
        options: q.options,
        isCorrect,
        correctAnswers: q.correctAnswers,
        userAnswers: userAns,
        explanation: q.explanation // Trả về giải thích sau khi thi xong
      };
    });

    const totalQuestions = questions.length;
    // Điểm thang 10, làm tròn 1 chữ số thập phân
    const score = totalQuestions > 0 ? parseFloat(((correctCount / totalQuestions) * 10).toFixed(1)) : 0;

    res.json({
      score,
      correctCount,
      totalQuestions,
      results,
      timeTaken,
      isOvertime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
