const Video = require('../models/Video');
const UpdateItem = require('../models/UpdateItem');
const Notification = require('../models/Notification');

/**
 * Fetch video list filtered by course type
 * GET /api/videos?courseType=A
 */
const getVideos = async (req, res) => {
  try {
    const { courseType } = req.query;
    // Tìm video theo loại khóa học và xếp theo thứ tự order tăng dần
    const videos = await Video.find({ courseType }).sort({ order: 1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Fetch all document update notices
 * GET /api/updates
 */
const getUpdates = async (req, res) => {
  try {
    // Sắp xếp bài đăng mới nhất lên đầu (-1 là Descending)
    const updates = await UpdateItem.find().sort({ date: -1 });
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Thêm thông báo mới
const createUpdate = async (req, res) => {
  try {
    const { content, driveLink, category } = req.body;
    const newUpdate = new UpdateItem({ content, driveLink, category });
    await newUpdate.save();

    // Tự động tạo Thông báo ra cộng đồng
    const newNotif = new Notification({
      message: `Tài liệu mới (${category}): ${content}`,
      link: `/` // Chuyển hướng về trang chủ
    });
    await newNotif.save();

    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Cập nhật thông báo
const updateUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, driveLink, category } = req.body;
    const updated = await UpdateItem.findByIdAndUpdate(id, { content, driveLink, category }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Xóa thông báo
const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    // Nhận password từ header
    const password = req.headers['x-admin-password'];
    
    // Kiểm tra mật khẩu (lấy từ file .env)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Sai mật khẩu Admin! Bạn không có quyền xóa." });
    }

    await UpdateItem.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getVideos, getUpdates, createUpdate, updateUpdate, deleteUpdate };
