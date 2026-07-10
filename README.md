# NLU Hub - Hệ Sinh Thái Sinh Viên Nông Lâm (IT-Proficiency)

Dự án phi lợi nhuận phát triển độc lập bởi sinh viên. Nền tảng chia sẻ, lưu trữ và trao đổi thông tin của sinh viên, do sinh viên, vì sinh viên (Đặc biệt tập trung vào các khóa học Tin học: Tin A, Tin B, Access).

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB (Mongoose)
- **CORS & Environment:** cors, dotenv

## 📁 Cấu trúc thư mục

```text
IT-Proficiency/
├── frontend/             # Ứng dụng React (Giao diện người dùng)
│   ├── src/              # Mã nguồn chính của Frontend (Components, Pages, App.jsx...)
│   ├── public/           # Assets tĩnh
│   ├── index.html        # Entry point HTML
│   ├── package.json      # Khai báo thư viện Frontend
│   ├── vite.config.js    # Cấu hình Vite
│   └── tailwind.config.js# Cấu hình Tailwind CSS
│
├── backend/              # Ứng dụng Node.js/Express (API Server)
│   ├── config/           # Cấu hình (Database, Môi trường...)
│   ├── controllers/      # Xử lý logic API (Req/Res)
│   ├── models/           # Định nghĩa Schema MongoDB (Mongoose)
│   ├── routers/          # Định nghĩa các Routes API
│   ├── index.js          # Entry point của Server
│   ├── seed.js           # Script tạo dữ liệu mẫu (Seeding)
│   └── package.json      # Khai báo thư viện Backend
│
├── Architecture_Vision.md# Tầm nhìn và định hướng kiến trúc tương lai của dự án
├── Feature_Inventory.md  # Thống kê chi tiết giao diện và tính năng hiện tại
└── Frontend_Spec.md      # Tài liệu đặc tả chức năng Frontend phục vụ Testing
```

## ✨ Các tính năng chính (Hiện tại)

1. **Trang Chủ (Home Page):**
   - Điều hướng nhanh đến các khóa học (Tin A, Tin B, Access).
   - Cộng đồng chia sẻ tài liệu: Đăng link Google Drive chia sẻ tài liệu theo môn học.
   - Hệ thống Chuông thông báo cộng đồng (Real-time cảm giác qua Polling/Event, lưu `localStorage`).

2. **Màn hình Khóa Học (Course Page):**
   - Xem video bài giảng (Nhúng iframe Youtube).
   - Danh sách bài học ở Sidebar.
   - Khu vực Hỏi đáp (Q&A) / Bình luận dưới mỗi video.
   - Liên kết làm bài tập thực hành & trắc nghiệm (Hiện đang dùng Google Forms).

## 🔮 Tầm nhìn tương lai (Roadmap)

- **Giai đoạn 2:** Kho Tài liệu Nông Lâm (Đăng nhập Google OAuth `@st.hcmuaf.edu.vn`, Upload PDF).
- **Giai đoạn 3:** Chợ sinh viên (Marketplace / Pass đồ) & Lost and Found.
- **Giai đoạn 4:** Review môn học (Đánh giá theo tiêu chí ẩn danh nhưng quản lý ID).

## ⚙️ Cài đặt & Chạy dự án (Local Development)

### 1. Khởi động Backend

```bash
cd backend
npm install
npm run start # Chạy server với nodemon
```

_Lưu ý: Cần cấu hình file `.env` chứa URL kết nối MongoDB._

### 2. Khởi động Frontend

```bash
cd frontend
npm install
npm run dev # Chạy Vite dev server
```

---

_Lưu ý pháp lý:_ Mọi thông tin trên nền tảng mang tính chất tham khảo và không đại diện cho quan điểm của trường ĐH Nông Lâm TP.HCM.
