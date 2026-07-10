const mongoose = require('mongoose');

/**
 * Question Schema
 * Represents a single multiple-choice question.
 */
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }], // Các đáp án: ["A. ...", "B. ...", "C. ...", "D. ..."]
  correctAnswers: [{ type: String, required: true }], // Các đáp án đúng (Mảng để hỗ trợ câu hỏi chọn nhiều)
  explanation: { type: String, default: "" }, // Lời giải thích từ AI hoặc giảng viên
  courseType: { type: String, enum: ['A', 'B', 'ACCESS'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
