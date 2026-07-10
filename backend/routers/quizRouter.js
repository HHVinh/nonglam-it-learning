const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Lấy bộ câu hỏi ngẫu nhiên (Query params: ?subject=A&limit=60)
router.get('/random', quizController.getRandomQuiz);

// Nộp bài và chấm điểm
router.post('/submit', quizController.submitQuiz);

module.exports = router;
