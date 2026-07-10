const mongoose = require('mongoose');

const updateItemSchema = new mongoose.Schema({
  content: { type: String, required: true },
  driveLink: { type: String, required: true },
  // Category CHỈ cho phép nhập 1 trong 4 chữ dưới đây (Đề phòng nhập sai chính tả)
  category: { type: String, enum: ['Chung', 'Tin A', 'Tin B', 'Access'], default: 'Access' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UpdateItem', updateItemSchema);
