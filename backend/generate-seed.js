const fs = require('fs');

const seedContent = fs.readFileSync('seed.js', 'utf8');

// Trích xuất mảng sampleVideos
const videosMatch = seedContent.match(/const sampleVideos = (\[[\s\S]*?\]);\n\nconst sampleUpdates/);
if (!videosMatch) {
  console.log("Could not find sampleVideos");
  process.exit(1);
}

const videosStr = videosMatch[1];
const sampleVideos = eval(videosStr);

// Phân nhóm
sampleVideos.forEach(v => {
  let section = "Chưa phân loại";
  let title = v.title.trim();

  // Khóa ACCESS
  if (v.courseType === "ACCESS") {
    if (title.startsWith("Buổi")) {
      section = title.split(" - ")[0]; // "Buổi 1"
    } else {
      section = "Khác";
    }
  } 
  // Khóa Tin A
  else if (v.courseType === "A") {
    if (title.startsWith("Buổi")) {
      const match = title.match(/^(Buổi \d+ - [A-Za-z]+( Nâng Cao)?)/i);
      if (match) {
        section = match[1]; // VD: "Buổi 1 - Excel"
      } else {
        const match2 = title.match(/^(Buổi \d+ - Sửa [B|b]ài [T|t]ập( [A-Za-z]+)?)/i);
        if (match2) {
            section = match2[1]; // VD: "Buổi 5 - Sửa bài tập Excel"
        } else {
            section = title.split(" - ")[0]; // Mặc định là "Buổi X"
        }
      }
    } else if (title.toLowerCase().includes("chuẩn bị") || title.toLowerCase().includes("hướng dẫn")) {
      section = "Mở đầu";
    } else if (title.toLowerCase().includes("xem thêm")) {
      section = "Xem thêm";
    } else {
      section = "Khác";
    }
  } 
  // Khóa Tin B
  else if (v.courseType === "B") {
    if (title.startsWith("Tin B - ")) {
      const match = title.match(/^Tin B - (Buổi \d+)/i);
      if (match) {
        section = match[1]; // "Buổi 1"
        if (title.includes("XEM THÊM")) {
           section = "Mục Lục Mở Rộng (Xem Thêm)";
        }
      } else {
        section = "Tin B";
      }
    } else if (title.toLowerCase().includes("chuẩn bị") || title.toLowerCase().includes("hướng dẫn")) {
      section = "Mở đầu";
    } else {
      section = "Khác";
    }
  }
  
  // Xóa bớt khoảng trắng thừa
  v.section = section.trim();
});

// Chèn lại vào nội dung cũ, đồng thời đổi console.log("...V2...") thành "...V3..."
const newVideosStr = JSON.stringify(sampleVideos, null, 2).replace(/"([^"]+)":/g, '$1:');
let newSeedContent = seedContent.replace(videosMatch[1], newVideosStr);
newSeedContent = newSeedContent.replace(/V2/g, 'V3');

fs.writeFileSync('seed-v3.js', newSeedContent);
console.log("✅ Đã tạo thành công file seed-v3.js với trường section!");
