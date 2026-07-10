const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const folders = ['tinA', 'tinB'];

let totalErrors = 0;

folders.forEach(folder => {
  const folderPath = path.join(dataDir, folder);
  if (!fs.existsSync(folderPath)) return;
  
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));
  
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const questions = JSON.parse(content);
      const expectedCount = folder === 'tinA' ? 60 : 50;
      
      let fileErrors = [];
      
      // 1. Check total count
      if (questions.length !== expectedCount) {
        fileErrors.push(`⚠️ Số lượng câu hỏi không đúng: Đang có ${questions.length} câu (Yêu cầu: ${expectedCount})`);
      }
      
      // 2. Check each question
      questions.forEach((q, idx) => {
        const qNum = idx + 1;
        
        // A. Check options count and A/B/C/D format
        if (!q.options || q.options.length !== 4) {
          fileErrors.push(`[Câu ${qNum}]: Không đủ 4 đáp án.`);
        } else {
          const prefixes = ['A. ', 'B. ', 'C. ', 'D. '];
          q.options.forEach((opt, oIdx) => {
            if (!opt.startsWith(prefixes[oIdx])) {
              fileErrors.push(`[Câu ${qNum}]: Đáp án thứ ${oIdx + 1} không bắt đầu bằng "${prefixes[oIdx]}". (Thực tế: ${opt})`);
            }
          });
        }
        
        // B. Check correctAnswers
        if (!q.correctAnswers || q.correctAnswers.length === 0) {
          fileErrors.push(`[Câu ${qNum}]: Không có đáp án đúng.`);
        } else {
          q.correctAnswers.forEach(ans => {
            if (!q.options.includes(ans)) {
              fileErrors.push(`[Câu ${qNum}]: Đáp án đúng "${ans}" không khớp hoàn toàn với bất kỳ lựa chọn nào trong options.`);
            }
          });
        }
      });
      
      if (fileErrors.length > 0) {
        console.log(`\n❌ LỖI TẠI FILE: ${folder}/${file}`);
        fileErrors.forEach(err => console.log(`  - ${err}`));
        totalErrors += fileErrors.length;
      }
      
    } catch (err) {
      console.log(`\n❌ LỖI ĐỌC FILE JSON: ${folder}/${file} - ${err.message}`);
      totalErrors++;
    }
  });
});

if (totalErrors === 0) {
  console.log('\n✅ CHÚC MỪNG: Toàn bộ cấu trúc các đề thi (Số câu hỏi, A/B/C/D, Đáp án đúng) đều hoàn hảo!');
} else {
  console.log(`\n⚠️ Phát hiện tổng cộng ${totalErrors} lỗi cấu trúc cần sửa.`);
}
