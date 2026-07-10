const fs = require('fs');
const path = require('path');

const text = fs.readFileSync('/Users/vinh/Documents/LearningForWork/sourcesSeed.txt', 'utf8');
const lines = text.split('\n');

const videos = [];
let orderA = 1;
let orderB = 1;
let orderAccess = 1;

for (let line of lines) {
  line = line.trim();
  if (!line || !line.includes('http')) continue;

  const parts = line.split('http');
  const title = parts[0].replace(':', '').trim();
  const url = 'http' + parts[1].trim();

  let youtubeId = '';
  const match = url.match(/youtu\.be\/([^?]+)/);
  if (match) {
    youtubeId = match[1];
  } else {
    const vMatch = url.match(/v=([^&]+)/);
    if (vMatch) youtubeId = vMatch[1];
  }

  if (!youtubeId) continue;

  let courseType = 'B';
  if (title.toUpperCase().includes('TIN A') || title.toUpperCase().includes('TIN CĂN BẢN')) {
    courseType = 'A';
  } else if (title.toUpperCase().includes('ACCESS')) {
    courseType = 'ACCESS';
  } else {
    courseType = 'B';
  }

  let order = 1;
  if (courseType === 'A') order = orderA++;
  else if (courseType === 'B') order = orderB++;
  else if (courseType === 'ACCESS') order = orderAccess++;

  videos.push({
    title,
    youtubeId,
    courseType,
    order
  });
}

const seedPath = path.join(__dirname, 'seed.js');
let seedCode = fs.readFileSync(seedPath, 'utf8');

const replacement = 'const sampleVideos = ' + JSON.stringify(videos, null, 2) + ';';

// Tìm array sampleVideos cũ và thay thế bằng array mới.
// Do array trong seed.js cũ khá đơn giản, ta dùng regex để thay thế.
const regex = /const sampleVideos = \[[^]*?\];/m;
seedCode = seedCode.replace(regex, replacement);

fs.writeFileSync(seedPath, seedCode);
console.log('Đã ghi đè sampleVideos vào seed.js thành công với ' + videos.length + ' video!');
