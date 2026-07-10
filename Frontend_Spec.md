# Tài Liệu Đặc Tả Chức Năng (Frontend) - Website Tin Học Nông Lâm

**Phiên bản:** 1.0  
**Ngày cập nhật:** 30/06/2026  
**Mục đích:** Cung cấp thông tin đặc tả hành vi của ứng dụng để phục vụ việc viết Test Case và kiểm thử (QA/QC).

---

## 1. Màn hình Trang Chủ (Home Page)

### 1.1. Khu vực Hero (Giới thiệu)
- **Nút "Bắt đầu khóa Tin A / Tin B / Access":** Click vào sẽ chuyển hướng sang trang `/tin-a`, `/tin-b`, hoặc `/access`.
- **Nút "Quyết định CĐR":** Mở sang tab mới, trỏ về trang web của trường.
- **Nút "Góp ý phát triển Website":** Mở tab mới tới Google Forms.
- **Bộ đếm lượt truy cập:** Tự động tăng 1 mỗi khi load lại trang. Hiển thị số nguyên.

### 1.2. Chức năng Cộng đồng chia sẻ tài liệu
- **Form đăng bài:**
  - **Tiêu đề (Text):** Không được để trống.
  - **Link Drive (Text):** Không được để trống.
  - **Category (Select):** Mặc định chọn `Access`. Các option: `Chung`, `Tin A`, `Tin B`, `Access`.
  - **Nút "Đăng bài":** Nếu để trống Tiêu đề hoặc Link, Form mặc định của trình duyệt sẽ báo lỗi (thuộc tính `required`).
- **Hiển thị danh sách tài liệu:**
  - Mặc định hiển thị 10 bài mới nhất.
  - Sắp xếp: Giảm dần theo thời gian (Bài mới nhất lên đầu).
  - Có các nút Lọc (Filter): `Tất cả`, `Access`, `Tin A`, `Tin B`, `Chung`. Bấm vào sẽ chỉ hiện bài thuộc danh mục đó.
  - Nút "Tải thêm": Nhấn vào sẽ tải thêm tối đa 10 bài nữa.
- **Chức năng Xóa:**
  - Khi nhấn nút "Xóa", hiển thị hộp thoại `prompt` yêu cầu nhập mật khẩu.
  - Nếu nhập đúng mật khẩu admin (123456): Xóa thành công.
  - Nếu nhập sai: Hiển thị `alert` báo lỗi.

---

## 2. Màn hình Khóa Học (Course Page: Tin A / Tin B / Access)

### 2.1. Bố cục Video & Bài học
- **Thanh bên trái (Sidebar):** Hiển thị danh sách các bài học. Nhấn vào bài nào, video bài đó sẽ hiển thị ở màn hình chính.
- **Trình phát Video (Main):** Nhúng video từ YouTube bằng `iframe`. 
- **Nút chức năng:**
  - Tải tài liệu bài học (Mở tab mới).
  - Ôn trắc nghiệm bài học (Mở tab mới).

### 2.2. Khu vực Thảo luận (Bình luận)
- Mỗi Video sẽ có một không gian bình luận ĐỘC LẬP.
- **Form bình luận:**
  - **Tên (Text):** Yêu cầu nhập (required).
  - **Nội dung (Text):** Yêu cầu nhập (required).
  - Bấm "Gửi bình luận": Lưu vào database, hiển thị ngay lập tức lên giao diện và xóa trắng form. Thời gian hiển thị chuẩn format VN.

---

## 3. Hệ thống Chuông thông báo cộng đồng (Global Notification)

- **Vị trí:** Nằm ở góc trên bên phải trang chủ (HomePage).
- **Hành vi Nút Chuông:**
  - Hiển thị số lượng thông báo "chưa đọc" (màu đỏ).
  - Trạng thái chưa đọc được lưu trong `localStorage` để phân biệt theo từng trình duyệt.
  - Khi click vào chuông: 
    1. Hiển thị Dropdown danh sách tối đa 30 thông báo (có thanh cuộn).
    2. Reset số đếm màu đỏ về 0.
  - Khi click ra ngoài vùng chuông: Tự động đóng Dropdown.
- **Hành vi Thông báo:**
  - Nhấn vào một thông báo: Tự động chuyển hướng tới trang Khóa học tương ứng và mở đúng Video đang được nhắc tới (thông qua tham số `?videoId=...` trên URL).
- **Xóa thông báo:** Có nút thùng rác, yêu cầu nhập pass admin (123456). Xóa sai báo alert lỗi.

---

## 4. UI/UX & Responsive

- **Desktop (> 768px):** Bố cục chia cột (Sidebar bên trái, Nội dung bên phải).
- **Mobile (< 768px):** Bố cục dọc (Cột xếp chồng). Menu danh sách video giới hạn chiều cao (max-height: 40vh) và có thanh cuộn để tránh đẩy video xuống quá sâu.
- **Đồng bộ UI:** Các thẻ `<input>` và `<select>` phải có chiều cao bằng nhau trên mọi thiết bị (đặc biệt là iOS Safari).
