require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Question = require('./models/Question');

const seedQuizzes = async () => {
  try {
    await connectDB();
    console.log("⏳ Dọn dẹp dữ liệu câu hỏi cũ trong MongoDB...");
    await Question.deleteMany({});

    const dataFolders = [
      { folder: 'tinA', courseType: 'A' },
      { folder: 'tinB', courseType: 'B' }
    ];

    let totalInserted = 0;

    for (const { folder, courseType } of dataFolders) {
      const folderPath = path.join(__dirname, 'data', folder);
      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️ Không tìm thấy thư mục ${folderPath}`);
        continue;
      }

      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));
      
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        try {
          const questions = JSON.parse(fileContent);
          
          // Trích xuất tên đề từ tên file (Ví dụ: "Quiz - Trắc nghiệm tin A - Đề 6.txt" -> "Đề 6")
          const normalizedFile = file.normalize('NFC');
          const examIdMatch = normalizedFile.match(/(Đề \d+)/i);
          const examId = examIdMatch ? examIdMatch[1] : null;

          const preparedQuestions = questions.map(q => ({
            ...q,
            courseType,
            examId
          }));

          await Question.insertMany(preparedQuestions);
          totalInserted += preparedQuestions.length;
          console.log(`✅ Đã thêm ${preparedQuestions.length} câu từ file ${file}`);
        } catch (err) {
          console.error(`❌ Lỗi parse JSON file ${file}:`, err);
        }
      }
    }

    console.log(`🎉 Thành công! Đã thêm tổng cộng ${totalInserted} câu hỏi vào Database.`);
    process.exit(0);
  } catch (error) {
    console.error("🔴 Lỗi rải mầm câu hỏi:", error);
    process.exit(1);
  }
};

seedQuizzes();
