const mongoose = require('mongoose');

const courseStatsSchema = new mongoose.Schema({
  courseType: { type: String, required: true, unique: true }, // 'A', 'B', 'ACCESS'
  viewCount: { type: Number, default: 0 },
  submitCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('CourseStats', courseStatsSchema);
