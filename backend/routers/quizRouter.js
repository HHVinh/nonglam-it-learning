const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Lấy bộ câu hỏi ngẫu nhiên (Query params: ?subject=A&limit=60)
router.get('/random', quizController.getRandomQuiz);

// Lấy bộ câu hỏi Nâng cao (Query params: ?subject=A&limit=60)
router.get('/hardcore', quizController.getHardcoreQuiz);

// Lấy danh sách các đề thi có sẵn của 1 môn học (?subject=A)
router.get('/exams', quizController.getExams);

// Lấy câu hỏi của 1 đề cụ thể (?subject=A&examId=Đề 10)
router.get('/exam', quizController.getExamByExamId);

// Nộp bài và chấm điểm
router.post('/submit', quizController.submitQuiz);

module.exports = router;
