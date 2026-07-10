const Notification = require('../models/Notification');

// Lấy danh sách thông báo (Giới hạn 30 cái mới nhất)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông báo", error: error.message });
  }
};

// Xóa thông báo (Admin)
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const password = req.headers['x-admin-password'];
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Sai mật khẩu Admin!" });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa thông báo thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa thông báo", error: error.message });
  }
};

module.exports = { getNotifications, deleteNotification };
