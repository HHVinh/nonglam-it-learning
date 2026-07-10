const mongoose = require('mongoose');

/**
 * Video Schema
 * Represents a video lesson in the platform.
 */
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  section: { type: String, required: true }, // Nhóm bài học (Accordion Section)
  youtubeId: { type: String, required: true },
  courseType: { type: String, enum: ['A', 'B', 'ACCESS'], required: true },
  order: { type: Number, required: true }, // Thứ tự bài học (1, 2, 3...)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
