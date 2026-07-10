# Thống kê Giao diện & Tính năng (Feature Inventory)
**Dự án:** Website Tin học Nông Lâm  
**Mục đích:** Cung cấp bức tranh toàn cảnh để phục vụ việc Thiết kế lại (Redesign) UI/UX.

---

## 1. Cấu trúc Điều hướng (Routing)
Trang web hiện tại đang có 2 loại màn hình chính (Pages) được điều hướng qua `App.jsx`:
- Màn hình **Trang Chủ** (`/`)
- Màn hình **Khóa Học** (Gồm 3 đường dẫn dùng chung một layout: `/tin-a`, `/tin-b`, `/access`)

---

## 2. Chi tiết Màn hình TRANG CHỦ (`HomePage.jsx`)

Trang chủ là trung tâm điều hướng và là nơi sinh viên hoạt động cộng đồng.

### 2.1. Khu vực Hero (Giới thiệu & Điều hướng)
- **Tiêu đề & Slogan:** Dòng chữ lớn đập vào mắt người dùng.
- **Cụm nút Khóa học (Button Group):** 3 nút lớn để đi tới 3 khóa học (Tin A, Tin B, Access).
- **Cụm liên kết ngoài (External Links):** Nút đi tới Trang chủ AIC và Nút xem Quyết định Chuẩn đầu ra.
- **Nút Góp ý (Feedback):** Nút màu vàng cam nhấp nháy, link ra ngoài Google Forms.
- **Badge Lượt truy cập:** Hiển thị tổng số người đã từng vào web (Bộ đếm lấy từ Database).

### 2.2. Khu vực Chuông Thông Báo (Notification Bell)
- **Vị trí:** Nổi ở góc trên bên phải.
- **Thành phần:** 
  - Nút chuông (Kèm con số màu đỏ đếm lượng thông báo chưa đọc, quản lý qua `localStorage`).
  - Bảng Dropdown xổ xuống (Hiển thị 30 thông báo mới nhất, có thanh cuộn).
- **Tính năng:** Bấm vào một thông báo sẽ tự động nhảy sang trang Khóa Học và mở đúng video đang được nhắc tới. Có thể xóa nếu có pass admin. Bấm ra ngoài vùng hiển thị thì tự tắt.

### 2.3. Khu vực Cộng đồng chia sẻ tài liệu
- **Cụm Lọc (Filters):** Các nút bo tròn để lọc tài liệu (Tất cả, Access, Tin A, Tin B, Chung).
- **Form Đăng Bài:** Gồm 1 ô Tiêu đề, 1 ô Link Drive, 1 ô thả xuống chọn Môn học, và nút Đăng Bài.
- **Danh sách Tài liệu (Feed):**
  - Hiển thị từng thẻ (Card) tài liệu.
  - Mỗi thẻ gồm: Tag màu sắc môn học, Ngày đăng, Tiêu đề (Bấm vào mở link Drive), Nút Xóa (Yêu cầu pass admin).
- **Nút Tải Thêm (Load More):** Mặc định hiện 10 bài, bấm để tải thêm 10 bài nữa.

---

## 3. Chi tiết Màn hình KHÓA HỌC (`CoursePage.jsx`)

Đây là màn hình sinh viên dành nhiều thời gian nhất để xem video và hỏi đáp.

### 3.1. Header Khóa học
- **Nút Back (Quay lại Trang chủ):** Nằm ở góc trái.
- **Tiêu đề Khóa học:** Thay đổi linh hoạt tùy theo tham số truyền vào (Tin A, Tin B, Access).
- **Bộ nút Tài liệu (Góc phải):**
  - Nút tải Tài liệu thực hành (Google Drive).
  - Nút ôn Trắc nghiệm (Google Docs/Forms).

### 3.2. Bố cục Chia cột (Sidebar + Main Content)
- **Cột Trái (Sidebar - Danh sách bài học):**
  - Hiển thị danh sách các bài học (Video) dạng Menu dọc.
  - Có hiệu ứng đổi màu (`active`) cho bài đang được xem.
  - Trên điện thoại, cột này bị đẩy lên trên cùng, có giới hạn chiều cao (`max-height: 40vh`) và thanh cuộn dọc.
- **Cột Phải (Main Content - Trình phát Video):**
  - Trình phát Youtube (Iframe) tự động co giãn 16:9.
  - Tiêu đề Video đang xem.
  - Tên môn học hiển thị bên dưới.

### 3.3. Khu vực Bình luận & Hỏi đáp (Q&A)
- Nằm ngay bên dưới Trình phát Video.
- **Form gửi bình luận:** Ô nhập Tên, Ô nhập Nội dung (textarea) và nút Gửi.
- **Danh sách bình luận:** 
  - Hiển thị các câu hỏi/nhận xét của các bạn khác.
  - Mỗi bình luận gồm Tên (in đậm), Ngày tháng và Nội dung.
  - (Chức năng ẩn) Bình luận mới sẽ tự động kích hoạt tạo 1 Thông báo mới ở ngoài Trang chủ.

---

## 4. Các yếu tố UI/UX Toàn cục (Global)
- **Màu sắc chủ đạo:** Hiện đang xài tone màu Dark Theme (Xanh đen `#2c3e50`, Trắng, Cam `#f39c12`, Xanh lá `#27ae60`, Xanh dương `#3498db`).
- **Font chữ:** Hiện đang xài font hệ thống cơ bản.
- **Responsive:** Hệ thống tự động chuyển từ cột ngang sang xếp chồng dọc trên màn hình di động (<768px).
- **Hiệu ứng báo lỗi/thành công:** Đang sử dụng thẻ Toast Notification (bay từ phải sang) khi thao tác thành công.
- **Mật khẩu Admin:** Các thao tác Xóa tài liệu, Xóa thông báo hiện đang ẩn đằng sau một cái hộp thoại Prompt, ai biết mật khẩu mới xóa được.

> [!TIP]
> Việc liệt kê này giống như vẽ lại "Bản đồ ngôi nhà" trước khi đập đi xây lại. Nếu em muốn thiết kế lại toàn bộ, em có thể làm giao diện cho từng màn hình trên, hoặc cấu trúc lại (Ví dụ: Đưa Chuông thông báo vào một thanh Menu cố định trên cùng thay vì thả nổi). Em định sẽ thiết kế bằng công cụ nào (Figma hay vẽ tay)?
