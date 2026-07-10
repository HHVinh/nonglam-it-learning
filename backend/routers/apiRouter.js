const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');
const commentController = require('../controllers/commentController');
const visitController = require('../controllers/visitController');
const notificationController = require('../controllers/notificationController');

// 1. Quản lý Video
router.get('/videos', apiController.getVideos);

// 2. Quản lý Bảng Thông Báo (UpdateItem)
router.get('/updates', apiController.getUpdates);
router.post('/updates', apiController.createUpdate);
router.put('/updates/:id', apiController.updateUpdate);
router.delete('/updates/:id', apiController.deleteUpdate);

// 3. Quản lý Bình luận
router.get('/comments/:videoId', commentController.getCommentsByVideoId);
router.post('/comments', commentController.createComment);
router.delete('/comments/:id', commentController.deleteComment);

// 4. Quản lý Đếm Lượt Truy Cập
router.get('/visits', visitController.getVisitCount);
router.post('/visits', visitController.incrementVisitCount);

// 5. Quản lý Thông báo cộng đồng
router.get('/notifications', notificationController.getNotifications);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;
