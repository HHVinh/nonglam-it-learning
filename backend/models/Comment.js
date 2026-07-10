const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // ObjectId dùng để móc nối (nhận diện) bình luận này thuộc về cái Video nào
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
