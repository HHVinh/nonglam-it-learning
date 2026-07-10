const Comment = require('../models/Comment');
const Video = require('../models/Video');
const Notification = require('../models/Notification');

// 1. Lấy danh sách bình luận của 1 Video cụ thể
const getCommentsByVideoId = async (req, res) => {
  try {
    const { videoId } = req.params;
    // Tìm các bình luận có videoId trùng khớp, sắp xếp giảm dần theo thời gian (mới nhất lên đầu)
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tải bình luận", error: error.message });
  }
};

// 2. Gửi bình luận mới lên
const createComment = async (req, res) => {
  try {
    const { videoId, name, content } = req.body;
    
    // Tạo bình luận mới theo khuôn đúc
    const newComment = new Comment({ videoId, name, content });
    
    // Ném vào kho
    await newComment.save();
    
    // Tự động tạo Thông báo ra cộng đồng
    const video = await Video.findById(videoId);
    if (video) {
      let routePath = "";
      if (video.courseType === "A") routePath = "/tin-a";
      else if (video.courseType === "B") routePath = "/tin-b";
      else if (video.courseType === "ACCESS") routePath = "/access";
      
      const newNotif = new Notification({
        message: `💬 ${name} vừa bình luận ở bài: ${video.title}`,
        link: `${routePath}?videoId=${video._id}`
      });
      await newNotif.save();
    }

    // Báo cáo thành công và trả về bình luận vừa tạo
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi đăng bình luận", error: error.message });
  }
};

// 3. Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const password = req.headers['x-admin-password'];
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Sai mật khẩu Admin! Bạn không có quyền xóa bình luận này." });
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi xóa bình luận", error: error.message });
  }
};

module.exports = { getCommentsByVideoId, createComment, deleteComment };
