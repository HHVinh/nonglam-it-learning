const mongoose = require('mongoose');

/**
 * Quiz Schema
 * Represents a predefined set of questions for a specific quiz.
 */
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseType: { type: String, enum: ['A', 'B', 'ACCESS'], required: true },
  timeLimit: { type: Number, required: true }, // Thời gian làm bài tính bằng phút (vd: 20, 25)
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
