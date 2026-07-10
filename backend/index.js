require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Khởi tạo Lễ tân
const app = express();

// Gọi hàm đi nối ống nước tới kho MongoDB
connectDB();

// Cấp quyền Bảo vệ (Tránh lỗi CORS) và cho phép dịch Gói hàng JSON
app.use(cors());
app.use(express.json());

const apiRouter = require('./routers/apiRouter');
const quizRouter = require('./routers/quizRouter');

app.use('/api', apiRouter); // Tất cả các đường ống trên sẽ được gắn tiền tố /api
app.use('/api/quizzes', quizRouter); // Đường ống riêng cho thi trắc nghiệm


// Tạo 1 đường ống nháp để Test xem Lễ tân có nghe máy không
app.get('/', (req, res) => {
  res.send("Xin chào!");
});

// Bật đài phát thanh ở cổng từ Render cấp hoặc 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
