# Tầm Nhìn Kiến Trúc V2: Hệ Sinh Thái Sinh Viên Nông Lâm (NLU Hub)

Tầm nhìn của dự án đã vượt ra khỏi một trang web học tập đơn thuần. Đây là lộ trình để biến website thành một "Siêu ứng dụng" (Super App) - nơi giải quyết các vấn đề thường nhật của sinh viên ĐH Nông Lâm TP.HCM.

## 1. Định vị Thương hiệu & Vấn đề Pháp lý
- **Định vị:** Một nền tảng chia sẻ, lưu trữ và trao đổi thông tin **của sinh viên, do sinh viên, vì sinh viên**.
- **Tên gọi gợi ý:** NLU Hub, NLU Share, Góc Nông Lâm, NLU Connect... (Tuyệt đối không dùng chữ "Đại học Nông Lâm chính thức").
- **Disclaimer (Miễn trừ trách nhiệm):** Dưới chân trang (Footer) luôn phải có dòng chữ: *"Dự án phi lợi nhuận phát triển độc lập bởi nhóm sinh viên. Mọi thông tin mang tính chất tham khảo và không đại diện cho quan điểm của trường ĐH Nông Lâm TP.HCM."*

---

## 2. Phân Hệ Đăng Nhập (Google OAuth)
**Lợi ích của việc bắt buộc đăng nhập bằng Google (Đặc biệt là email `@st.hcmuaf.edu.vn`):**
1. **Xác thực sinh viên thật:** Lọc 100% người ngoài, bot, clone. Hệ sinh thái "sạch".
2. **Chịu trách nhiệm ngôn từ:** Khi dùng email sinh viên, các bạn sẽ có ý thức hơn khi review, bình luận hoặc đăng bài tìm đồ. Dễ dàng Ban (cấm) các tài khoản toxic.
3. **Cá nhân hóa:** Lưu lịch sử học tập, lưu bookmark tài liệu, quản lý bài đăng pass đồ cá nhân.
4. **An toàn:** Dùng Firebase Auth hoặc Google OAuth rất dễ code, không lo bị hack mật khẩu vì Google lo hết.

---

## 3. Phân Hệ Lưu Trữ Tài Liệu (Storage Strategy)
**Nên dùng Link GG Drive hay Upload Trực tiếp?**
- **Giải pháp tối ưu - Kết hợp (Hybrid):**
  - **Tài liệu nhẹ (PDF, Word, Excel, Hình ảnh < 5MB):** Cho phép **Upload trực tiếp**. Trải nghiệm sinh viên sẽ cực kỳ "sướng" vì bấm là xem/tải ngay. Không lo chủ file xóa GG Drive làm link chết. Dữ liệu này em lưu trên các dịch vụ Cloud miễn phí nhưng xịn như **Supabase Storage** hoặc **Firebase Storage** (free 1-5GB ban đầu, đủ chứa hàng ngàn file PDF).
  - **Dữ liệu siêu nặng (Video, File cài đặt):** Bắt buộc người dùng dán Link Youtube hoặc GG Drive. Server của sinh viên nghèo không thể gánh nổi băng thông video.

---

## 4. Phân Hệ Review Môn Học (Chống rủi ro pháp lý)
Mục này thu hút sinh viên nhất nhưng cũng "nguy hiểm" nhất. Nếu làm không khéo sẽ biến thành chỗ bóc phốt.
**Chiến lược thiết kế an toàn:**
1. **Không Review Giảng viên cá nhân:** Tuyệt đối không để mục "Tên giảng viên". Chỉ cho phép review "Môn học".
2. **Review theo Tiêu chí (Rating) thay vì viết văn dài:** Sinh viên đánh giá 1-5 sao cho các mục: 
   - Khối lượng bài tập / Đồ án.
   - Tính ứng dụng thực tế.
   - Độ khó thi cuối kỳ.
3. **Phần viết (Text):** Nếu có, hệ thống sẽ ẩn danh người đăng (Anonymous trên UI), nhưng Database vẫn lưu ID của email `@st` người đó để Admin nắm thóp. Đồng thời phải gắn cảnh báo: *"Vui lòng sử dụng ngôn từ chuẩn mực. Các bình luận công kích cá nhân sẽ bị xóa và khóa tài khoản vĩnh viễn."*

---

## 5. Phân Hệ Tìm Đồ Thất Lạc (Lost & Found)
Giải quyết triệt để vấn đề "trôi bài, loãng tin" của Facebook.
**Cấu trúc dữ liệu:**
- **Loại:** `Báo mất đồ` / `Nhặt được đồ`.
- **Danh mục:** `Ví/Giấy tờ`, `Chìa khóa`, `Thẻ SV`, `Đồ điện tử`, `Khác`.
- **Khu vực:** `Khu A`, `Khu B`, `Cẩm Tú`, `Thư viện`, `KTX`...
- **Trạng thái:** `Đang tìm` / `Đã giải quyết`.
- **Tính năng thông minh:** Nếu 1 người đăng "Nhặt được ví Khu A", và 1 người đăng "Mất ví Khu A" trong cùng 1 ngày, hệ thống sẽ hiển thị **"Có thể bạn đang tìm: [Link bài kia]"**.

---

## 6. Phân Hệ Chợ Sinh Viên (Marketplace / Pass đồ)
**Cấu trúc tương tự Lost & Found, thêm các trường:**
- **Giá bán:** (Có thể để "Thỏa thuận").
- **Tình trạng:** `Mới 100%`, `Sách đã highlight`, `Cũ`...
- **Hình ảnh:** Bắt buộc có ảnh thật (Upload qua Cloudinary / Firebase).
- **Liên hệ:** Chỉ hiện số điện thoại/Zalo khi người mua đã Đăng nhập vào hệ thống (Chống bot lấy số gọi lừa đảo).

---

## Lộ Trình Phát Triển Đề Xuất (Roadmap)
Đừng làm tất cả cùng lúc, sẽ bị ngợp!
1. **Giai đoạn 1 (Hiện tại):** Hoàn thiện Core 1 - Khóa học Tin học (Để validate kỹ năng Code và Deploy).
2. **Giai đoạn 2 (Tháng tới):** Triển khai Core 2 - Kho Tài liệu Nông Lâm (Phân loại cây thư mục, làm tính năng Đăng nhập Google, Upload PDF).
3. **Giai đoạn 3:** Mở khóa Core 3 - Lost & Found + Chợ Pass Đồ (Dùng chung 1 form thiết kế vì bản chất giống nhau).
4. **Giai đoạn 4:** Mở khóa Core 4 - Review Môn Học (Làm sau cùng vì cần nhiều logic kiểm duyệt).
