const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Video = require('./models/Video');
const UpdateItem = require('./models/UpdateItem');
const Comment = require('./models/Comment');
const VisitCount = require('./models/VisitCount');

const sampleVideos = [
  {
    "title": "Buổi 1 - Chuẩn Bị Trước Khi Học Access",
    "youtubeId": "vmC1htGTmuI",
    "courseType": "ACCESS",
    "order": 1
  },
  {
    "title": "Buổi 1 - Làm Quen Với Access",
    "youtubeId": "QH17vP8zUDk",
    "courseType": "ACCESS",
    "order": 2
  },
  {
    "title": "Buổi 1 - Import Dữ Liệu, Cài Định Dạng, Khoá Chính",
    "youtubeId": "YmdCrzIvLRk",
    "courseType": "ACCESS",
    "order": 3
  },
  {
    "title": "Buổi 1 - Tạo Liên Kết, Tính Query Select",
    "youtubeId": "q07RTe5qVAI",
    "courseType": "ACCESS",
    "order": 4
  },
  {
    "title": "Buổi 2 - Query Select 9 Đến Query Select 17",
    "youtubeId": "S73fZwfOGLc",
    "courseType": "ACCESS",
    "order": 5
  },
  {
    "title": "Buổi 2 - Query Total & Query Crosstab & Action Query",
    "youtubeId": "8hCxSNyX2o8",
    "courseType": "ACCESS",
    "order": 6
  },
  {
    "title": "Buổi 3 - Sửa Access Bài Tập 1",
    "youtubeId": "MJt7jyW0HyA",
    "courseType": "ACCESS",
    "order": 7
  },
  {
    "title": "Buổi 3 - Form",
    "youtubeId": "ESG7DszLgAI",
    "courseType": "ACCESS",
    "order": 8
  },
  {
    "title": "Buổi 3 - Report",
    "youtubeId": "nK4k4crFysk",
    "courseType": "ACCESS",
    "order": 9
  },
  {
    "title": "Buổi 4 - Sửa Access Bài Tập 2",
    "youtubeId": "gszI41ZzOG8",
    "courseType": "ACCESS",
    "order": 10
  },
  {
    "title": "Buổi 4 - Sửa Access Bài Tập 3",
    "youtubeId": "uPUgCPSanIQ",
    "courseType": "ACCESS",
    "order": 11
  },
  {
    "title": "Buổi 4 - Sửa Access Bài Tập 4",
    "youtubeId": "ItJn91Nbaeg",
    "courseType": "ACCESS",
    "order": 12
  },
  {
    "title": "Buổi 5 - Sửa Access Đề Tổng Hợp 4",
    "youtubeId": "evlbTn_vZtc",
    "courseType": "ACCESS",
    "order": 13
  },
  {
    "title": "Buổi 5 - Sửa Access Đề Tổng Hợp 5",
    "youtubeId": "cSDrD4wDgh0",
    "courseType": "ACCESS",
    "order": 14
  },
  {
    "title": "Xem Thêm Lỗi Liên Kết",
    "youtubeId": "W1mLxoJYTaU",
    "courseType": "ACCESS",
    "order": 15
  },
  {
    "title": "Chuẩn bị trước khi học chuẩn đầu ra tin",
    "youtubeId": "YmiAJBRITLs",
    "courseType": "A",
    "order": 1
  },
  {
    "title": "Hướng dẫn học tin A",
    "youtubeId": "HgL00Z7t30I",
    "courseType": "A",
    "order": 2
  },
  {
    "title": "Buổi 1 - Excel (Phần 1 Xử Lý Chuỗi)",
    "youtubeId": "CYICkib969E",
    "courseType": "A",
    "order": 3
  },
  {
    "title": "Buổi 1 - Excel (Phần 2 Địa Chỉ Hỗn Hợp)",
    "youtubeId": "lFsz41CzUoI",
    "courseType": "A",
    "order": 4
  },
  {
    "title": "Buổi 1 - Excel (Phần 3 Hàm IF - Hàm Logic)",
    "youtubeId": "z4MMntyvX98",
    "courseType": "A",
    "order": 5
  },
  {
    "title": "Buổi 1 - Excel (Phần 4 Hàm HLOOKUP & VLOOKUP)",
    "youtubeId": "7Y29tm5Bdy4",
    "courseType": "A",
    "order": 6
  },
  {
    "title": "Buổi 1 - Excel (Phần 5 Hàm SUMIF & COUNTIF)",
    "youtubeId": "iLJYpKrwwCA",
    "courseType": "A",
    "order": 7
  },
  {
    "title": "Buổi 1 - Sửa BTVN Buổi 1",
    "youtubeId": "q2f80sXfz-w",
    "courseType": "A",
    "order": 8
  },
  {
    "title": "Buổi 2 - Excel Phần 6 (Hàm Số Học)",
    "youtubeId": "ATmGE74DBos",
    "courseType": "A",
    "order": 9
  },
  {
    "title": "Buổi 2 - Excel Phần 7 (Biểu Đồ)",
    "youtubeId": "WXJfDc8Krm8",
    "courseType": "A",
    "order": 10
  },
  {
    "title": "Buổi 2 - Excel Phần 8 (Hàm Thời Gian)",
    "youtubeId": "TsYdJ7eslUI",
    "courseType": "A",
    "order": 11
  },
  {
    "title": "Buổi 2 - Excel Phần 9 (Sắp Xếp - Lọc)",
    "youtubeId": "Nk0m1eGWYUo",
    "courseType": "A",
    "order": 12
  },
  {
    "title": "Buổi 2 - Excel (Phần 10 Tách Dữ Liệu)",
    "youtubeId": "gJ_hfMUEd9E",
    "courseType": "A",
    "order": 13
  },
  {
    "title": "Buổi 2 - Excel Phần 11 (Định Dạng Bảng Tính)",
    "youtubeId": "VLnGvgv4tdI",
    "courseType": "A",
    "order": 14
  },
  {
    "title": "Buổi 2 - Sửa BTVN Buổi 2 - Ôn tập 1-2-3",
    "youtubeId": "aiaLtkbbt4M",
    "courseType": "A",
    "order": 15
  },
  {
    "title": "Buổi 3 - Word (Phần 1 Page Setup)",
    "youtubeId": "GynasAJKHSI",
    "courseType": "A",
    "order": 16
  },
  {
    "title": "Buổi 3 - Word (Phần 2 Font)",
    "youtubeId": "caL3zwDCaDg",
    "courseType": "A",
    "order": 17
  },
  {
    "title": "Buổi 3 - Word (Phần 3 Chia Cột, Shapes, Drop Cap & WordArt)",
    "youtubeId": "TgfvWSaIQXs",
    "courseType": "A",
    "order": 18
  },
  {
    "title": "Buổi 3 - Word (Phần 4 Tab)",
    "youtubeId": "g7ltQ5IsNwY",
    "courseType": "A",
    "order": 19
  },
  {
    "title": "Buổi 3 - Word (Phần 5 Bảng & Công Thức Toán Học)",
    "youtubeId": "CP9Q-Jmi-d0",
    "courseType": "A",
    "order": 20
  },
  {
    "title": "Buổi 3 - Word (Phần 6 Ngắt Trang & Số Trang)",
    "youtubeId": "bQ_2P8Lfo8Q",
    "courseType": "A",
    "order": 21
  },
  {
    "title": "Buổi 4 - Word Nâng Cao (2 Điểm)",
    "youtubeId": "HYhtjkR3aKs",
    "courseType": "A",
    "order": 22
  },
  {
    "title": "Buổi 4 - PowerPoint",
    "youtubeId": "gnHc1s4NjkQ",
    "courseType": "A",
    "order": 23
  },
  {
    "title": "Buổi 5 - Sửa bài tập Excel 1",
    "youtubeId": "Ek4LlY7k4sk",
    "courseType": "A",
    "order": 24
  },
  {
    "title": "Buổi 5 - Sửa bài tập Excel 2",
    "youtubeId": "RdtC0aricJg",
    "courseType": "A",
    "order": 25
  },
  {
    "title": "Buổi 5 - Sửa bài tập Excel 3",
    "youtubeId": "znxE6HXhA1k",
    "courseType": "A",
    "order": 26
  },
  {
    "title": "Buổi 5 - Sửa bài tập Excel 4",
    "youtubeId": "92fE1NqgjVo",
    "courseType": "A",
    "order": 27
  },
  {
    "title": "Buổi 5 - Sửa bài tập Excel 5",
    "youtubeId": "S7AlIy0_WvI",
    "courseType": "A",
    "order": 28
  },
  {
    "title": "Buổi 6 - Sửa bài tập Excel 6",
    "youtubeId": "GlGgfdsB398",
    "courseType": "A",
    "order": 29
  },
  {
    "title": "Buổi 6 - Sửa bài tập Excel 7",
    "youtubeId": "cKew1uy7mOE",
    "courseType": "A",
    "order": 30
  },
  {
    "title": "Buổi 6 - Sửa bài tập Excel 8",
    "youtubeId": "lNDhoUtBpHM",
    "courseType": "A",
    "order": 31
  },
  {
    "title": "Buổi 6 - Sửa bài tập Excel 9",
    "youtubeId": "W6oQ8_oapX8",
    "courseType": "A",
    "order": 32
  },
  {
    "title": "Buổi 6 - Sửa bài tập Excel 10 và 11",
    "youtubeId": "eldkicJo8Z8",
    "courseType": "A",
    "order": 33
  },
  {
    "title": "Buổi 7 - Sửa Bài Tập Word Đề 3 - Ppt Đề 1",
    "youtubeId": "mwTAtb0Q7GU",
    "courseType": "A",
    "order": 34
  },
  {
    "title": "Buổi 7 - Sửa Bài Tập Ppt Đề 4",
    "youtubeId": "sLJdaaud4Es",
    "courseType": "A",
    "order": 35
  },
  {
    "title": "Buổi 7 - Hướng Dẫn Học Trắc Nghiệm",
    "youtubeId": "tEjVLthHDjo",
    "courseType": "A",
    "order": 36
  },
  {
    "title": "Buổi 8 - Sửa Đề Excel ÔN THI 1",
    "youtubeId": "X91V6813S0k",
    "courseType": "A",
    "order": 37
  },
  {
    "title": "Buổi 8 - Sửa Đề Excel ÔN THI 2",
    "youtubeId": "X91V6813S0k",
    "courseType": "A",
    "order": 38
  },
  {
    "title": "Buổi 8 - Sửa Đề Excel ÔN THI 3",
    "youtubeId": "kJ3Aff9jFWI",
    "courseType": "A",
    "order": 39
  },
  {
    "title": "Buổi 8 - Sửa Đề Excel ÔN THI 6",
    "youtubeId": "0FkQ712Ky-c",
    "courseType": "A",
    "order": 40
  },
  {
    "title": "Buổi 9 - Sửa Full Đề Thi Thử 4",
    "youtubeId": "gYGTGaP268o",
    "courseType": "A",
    "order": 41
  },
  {
    "title": "Buổi 10 - Sửa Full Đề Ôn Thi 5",
    "youtubeId": "a_Ap36QtCig",
    "courseType": "A",
    "order": 42
  },
  {
    "title": "Buổi 11 - Ôn Tập Tổng Hợp Trước Khi Thi",
    "youtubeId": "xgGa1QXkkoM",
    "courseType": "A",
    "order": 43
  },
  {
    "title": "Xem Thêm Các Yêu Cầu Lạ Có Thể Gặp Khi Đi Thi",
    "youtubeId": "HkyynyXCZbA",
    "courseType": "A",
    "order": 44
  },
  {
    "title": "Chuẩn bị trước khi học chuẩn đầu ra tin",
    "youtubeId": "YmiAJBRITLs",
    "courseType": "B",
    "order": 1
  },
  {
    "title": "Hướng dẫn học tin A",
    "youtubeId": "-TTvqviAm1I",
    "courseType": "B",
    "order": 2
  },
  {
    "title": "Tin B - Buổi 1 - Advanced Filter Và Hàm Cơ Sở Dữ Liệu",
    "youtubeId": "QLvhXtTQ6-g",
    "courseType": "B",
    "order": 3
  },
  {
    "title": "Tin B - Buổi 1 - Consolidate",
    "youtubeId": "RIe67MkpuUU",
    "courseType": "B",
    "order": 4
  },
  {
    "title": "Tin B - Buổi 1 - Sửa BTVN Advanced Filter & Hàm Cơ Sở Dữ Liệu",
    "youtubeId": "4bb_JUYE0oM",
    "courseType": "B",
    "order": 5
  },
  {
    "title": "Tin B - Buổi 1 - Sửa BTVN Consolidate và Subtotal",
    "youtubeId": "JHpE6wqQ5WQ",
    "courseType": "B",
    "order": 6
  },
  {
    "title": "Tin B - Buổi 2 - Công Thức Mảng Và Data Table",
    "youtubeId": "zE5Z13upbGE",
    "courseType": "B",
    "order": 7
  },
  {
    "title": "Tin B - Buổi 2 - Subtotal",
    "youtubeId": "l8_UBavGHsU",
    "courseType": "B",
    "order": 8
  },
  {
    "title": "Tin B - Buổi 2 - Sửa BTVN Công Thức Mảng và Data Table",
    "youtubeId": "l8_UBavGHsU",
    "courseType": "B",
    "order": 9
  },
  {
    "title": "Tin B - Buổi 3 - Pivot Table & Chart",
    "youtubeId": "E5qqcsLvwPE",
    "courseType": "B",
    "order": 10
  },
  {
    "title": "Tin B - Buổi 3 - Tô Màu",
    "youtubeId": "b1UIyfo8eVw",
    "courseType": "B",
    "order": 11
  },
  {
    "title": "Tin B - Buổi 3 - Validation",
    "youtubeId": "diY85oAo86c",
    "courseType": "B",
    "order": 12
  },
  {
    "title": "Tin B - Buổi 3 - Sửa BTVN Pivot Table",
    "youtubeId": "aLzriuyWM1Y",
    "courseType": "B",
    "order": 13
  },
  {
    "title": "Tin B - Buổi 3 - Sửa BTVN Tô Màu",
    "youtubeId": "1DwqiQpMzNg",
    "courseType": "B",
    "order": 14
  },
  {
    "title": "Tin B - Buổi 3 - Sửa BTVN Validation",
    "youtubeId": "8d33iUl4zLY",
    "courseType": "B",
    "order": 15
  },
  {
    "title": "Tin B - Buổi 4 - Index",
    "youtubeId": "iqTkeYueL3Q",
    "courseType": "B",
    "order": 16
  },
  {
    "title": "Tin B - Buổi 4 - 5 Dạng",
    "youtubeId": "d0PkTWjAveA",
    "courseType": "B",
    "order": 17
  },
  {
    "title": "Tin B - Buổi 4 - Sửa BTVN Index",
    "youtubeId": "Vjl54h0y4dk",
    "courseType": "B",
    "order": 18
  },
  {
    "title": "Tin B - Buổi 4 - Sửa BTVN 5 Dạng",
    "youtubeId": "sCd9t2ne4rs",
    "courseType": "B",
    "order": 19
  },
  {
    "title": "Tin B - Buổi 5 - Solver",
    "youtubeId": "Y7iR4U-vwkw",
    "courseType": "B",
    "order": 20
  },
  {
    "title": "Tin B - Buổi 5 - Sửa BTVN Solver",
    "youtubeId": "JfWFRsu-pnw",
    "courseType": "B",
    "order": 21
  },
  {
    "title": "Tin B - Buổi 5 - Sửa Bài Ôn Tập 1",
    "youtubeId": "urE0n2t7BNA",
    "courseType": "B",
    "order": 22
  },
  {
    "title": "Tin B - Buổi 5 - Sửa Bài Ôn Tập 2",
    "youtubeId": "urE0n2t7BNA",
    "courseType": "B",
    "order": 23
  },
  {
    "title": "Tin B - Buổi 6 - Hàm Tài Chính",
    "youtubeId": "DwMX8vBta9o",
    "courseType": "B",
    "order": 24
  },
  {
    "title": "Tin B - Buổi 6 - Macro",
    "youtubeId": "hhc6nE8SlVc",
    "courseType": "B",
    "order": 25
  },
  {
    "title": "Tin B - Buổi 6 - Sửa Bài Ôn Tập 3",
    "youtubeId": "rQYU4CjwoHg",
    "courseType": "B",
    "order": 26
  },
  {
    "title": "Tin B - Buổi 6 - Sửa Bài Ôn Tập 4",
    "youtubeId": "mQx3CiOX-Ec",
    "courseType": "B",
    "order": 27
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 1",
    "youtubeId": "6lKAexxb8gE",
    "courseType": "B",
    "order": 28
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 2",
    "youtubeId": "z2bobnGLUr4",
    "courseType": "B",
    "order": 29
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 3",
    "youtubeId": "PFM_0oOrFbg",
    "courseType": "B",
    "order": 30
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 4",
    "youtubeId": "FPbLQA5J0wM",
    "courseType": "B",
    "order": 31
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 5",
    "youtubeId": "AnDmbCVcmvM",
    "courseType": "B",
    "order": 32
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 6",
    "youtubeId": "SalHr02uGHg",
    "courseType": "B",
    "order": 33
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 7",
    "youtubeId": "SalHr02uGHg",
    "courseType": "B",
    "order": 34
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 8",
    "youtubeId": "_g5QkvAG0IY",
    "courseType": "B",
    "order": 35
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 9",
    "youtubeId": "OK1PqwGv7C0",
    "courseType": "B",
    "order": 36
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 10",
    "youtubeId": "_JM0Z5Fls7I",
    "courseType": "B",
    "order": 37
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 11",
    "youtubeId": "l-cPL4ydwow",
    "courseType": "B",
    "order": 38
  },
  {
    "title": "Tin B - Buổi 7 - Sửa Đề Ôn Thi 12",
    "youtubeId": "1WGM2PiNbac",
    "courseType": "B",
    "order": 39
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 4",
    "youtubeId": "PO4Hc0FkWXc",
    "courseType": "B",
    "order": 40
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 5",
    "youtubeId": "MIOEiO2kSjc",
    "courseType": "B",
    "order": 41
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 6",
    "youtubeId": "hgwcZ3byM-w",
    "courseType": "B",
    "order": 42
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 8",
    "youtubeId": "VAz00fCDZCw",
    "courseType": "B",
    "order": 43
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 9",
    "youtubeId": "axmeknUzKEM",
    "courseType": "B",
    "order": 44
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 10",
    "youtubeId": "6m4uClDhwkc",
    "courseType": "B",
    "order": 45
  },
  {
    "title": "Tin B - Buổi 7 - Ôn Đề Trắc Nghiệm 11",
    "youtubeId": "86j_c6Z13Nk",
    "courseType": "B",
    "order": 46
  },
  {
    "title": "Tin B - Buổi 8 - Sửa bài ÔN THI Advanced & Hàm CSDL",
    "youtubeId": "kKgH2347NzQ",
    "courseType": "B",
    "order": 47
  },
  {
    "title": "Tin B - Buổi 8 - Sửa Bài ÔN THI Công Thức Mảng & Data Table",
    "youtubeId": "b_SRiHWAzsU",
    "courseType": "B",
    "order": 48
  },
  {
    "title": "Tin B - Buổi 8 - Sửa bài ÔN THI Index & Solver",
    "youtubeId": "aQgEoHSDv-Q",
    "courseType": "B",
    "order": 49
  },
  {
    "title": "Tin B - Buổi 8 - Sửa bài ÔN THI Các Dạng Khác",
    "youtubeId": "AK3oSdo5jhU",
    "courseType": "B",
    "order": 50
  },
  {
    "title": "Tin B - Buổi 9 - Sửa Đề Thi Thử 1",
    "youtubeId": "qEyFONAQSmo",
    "courseType": "B",
    "order": 51
  },
  {
    "title": "Tin B - Buổi 9 - Sửa Đề Thi Thử 2",
    "youtubeId": "avCtlaTt5RM",
    "courseType": "B",
    "order": 52
  },
  {
    "title": "Tin B - Buổi 10 - Sửa Đề Thi Thử 3",
    "youtubeId": "CAnu9IhQSB8",
    "courseType": "B",
    "order": 53
  },
  {
    "title": "Tin B - Buổi 10 - Sửa Đề Thi Thử 4",
    "youtubeId": "CAnu9IhQSB8",
    "courseType": "B",
    "order": 54
  },
  {
    "title": "Tin B - Buổi 11 - Sửa Đề Thi Thử Tin B Trung Tâm Và Ôn Tổng Hợp",
    "youtubeId": "gTv3G3XnlT0",
    "courseType": "B",
    "order": 55
  },
  {
    "title": "Tin B - Buổi 12 - XEM THÊM - Các Dạng Mới Gặp Gần Đây",
    "youtubeId": "KIhimQg5m_E",
    "courseType": "B",
    "order": 56
  },
  {
    "title": "Tin B - Buổi 12 - XEM THÊM - What if Analysis",
    "youtubeId": "ONfNl149naw",
    "courseType": "B",
    "order": 57
  }
];

const sampleUpdates = [
  { content: "Tài liệu tin B Trung Tâm tháng 5/2026 (Mật khẩu là 1)", 
    driveLink: "https://drive.google.com/file/d/1MaNlBqvsGBX6_HU57lk-6q0EEdEdxUEf/view?usp=sharing", 
    category: "Tin B" },
  { content: "Tài liệu tin B Trung Tâm tháng 1/2026 (Mật khẩu là 1)", 
    driveLink: "https://drive.google.com/file/d/1HgQomHMLPKiKSdanXYeMHUyhKYbAc_Jj/view?usp=sharing", 
    category: "Tin B" }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log("⏳ Dọn dẹp dữ liệu cũ...");
    await Video.deleteMany({});
    await UpdateItem.deleteMany({});
    await Comment.deleteMany({});
    await VisitCount.deleteMany({});

    console.log("🌱 Rải mầm dữ liệu V2...");
    await Video.insertMany(sampleVideos);
    await UpdateItem.insertMany(sampleUpdates);
    // Nhồi sẵn 1205 view cho đẹp
    await VisitCount.create({ count: 1205 }); 

    console.log("✅ Thành công! Dữ liệu V2 đã sẵn sàng.");
    process.exit();
  } catch (error) {
    console.error("🔴 Lỗi rải mầm:", error);
    process.exit(1);
  }
};

seedData();
