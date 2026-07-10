const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI;
    await mongoose.connect(URI);
    console.log("Kết nối thành công MongoDB IT-Proficiency!");
  } catch (error) {
    console.log("Lỗi kết nối MongoDB IT-Proficiency!", error);
  }
};

// Xuất khẩu hàm này để Lễ tân gọi
module.exports = connectDB;
