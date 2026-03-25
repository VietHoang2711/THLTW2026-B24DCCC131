# Hệ Thống Quản Lý Văn Bằng Tốt Nghiệp

## Tổng Quan
Ứng dụng giúp Phòng Chuyên viên quản lý sổ văn bằng tốt nghiệp của sinh viên và cho phép người dùng tra cứu thông tin văn bằng.

## Các Chức Năng Chính

### 1. Sổ Văn Bằng
**Đường dẫn**: `/bang-cap`

Quản lý sổ văn bằng theo từng năm:
- **Tạo Sổ Mới**: Mỗi năm tạo 1 sổ mới, tự động reset số vào sổ về 1
- **Trạng Thái**: Sổ có 2 trạng thái: Mở (đang sử dụng) và Đóng (kết thúc năm)
- **Số Vào Sổ**: Tự động tăng dần khi thêm văn bằng mới
- **Thông Tin**:
  - Năm
  - Số Văn Bằng (để định danh)
  - Ngày Mở
  - Trạng Thái
  - Số Lượng Văn Bằng

**Thao Tác**:
- Tạo sổ mới
- Chỉnh sửa thông tin sổ (khi sổ chưa đóng)
- Đóng sổ (chuyển sang trạng thái không thêm được nữa)

---

### 2. Quyết Định Tốt Nghiệp
**Đường dẫn**: `/bang-cap` -> Tab "Quyết Định Tốt Nghiệp"

Quản lý các đợt tốt nghiệp trong năm:
- Mỗi đợt sinh viên tốt nghiệp tương ứng với 1 quyết định
- **Thông Tin Quyết Định**:
  - Số QĐ (Số quyết định)
  - Ngày Ban Hành
  - Trích Yếu (nội dung tóm tắt)
  - Sổ Văn Bằng (liên kết đến sổ nào)
  - Số Sinh Viên (tự động cập nhật khi thêm văn bằng)

**Thao Tác**:
- Tạo quyết định mới
- Chỉnh sửa thông tin quyết định
- Xóa quyết định (nếu chưa có sinh viên)

---

### 3. Cấu Hình Biểu Mẫu Phụ Lục Văn Bằng
**Đường dẫn**: `/bang-cap` -> Tab "Cấu Hình Biểu Mẫu"

Quản trị viên cấu hình các trường thông tin sẽ được lưu trong hệ thống:
- **Kiểu Dữ Liệu Hỗ Trợ**:
  - **String** (Chuỗi): Dân tộc, Nơi sinh, Xếp hạng, Hệ đào tạo
  - **Number** (Số): Điểm trung bình, Điểm GPA
  - **Date** (Ngày): Ngày nhập học, Ngày tốt nghiệp

- **Thông Tin Trường**:
  - Tên Trường (Dân tộc, Nơi sinh, etc.)
  - Kiểu Dữ Liệu
  - Bắt Buộc/Tùy Chọn
  - Thứ Tự Hiển Thị

**Thao Tác**:
- Thêm trường mới
- Chỉnh sửa trường (tên, kiểu, bắt buộc, thứ tự)
- Xóa trường

**Ví Dụ Cấu Hình Mặc Định**:
- Dân Tộc (String, Bắt buộc)
- Nơi Sinh (String, Tùy chọn)
- Điểm Trung Bình (Number, Bắt buộc)
- Ngày Nhập Học (Date, Bắt buộc)

---

### 4. Thông Tin Văn Bằng
**Đường dẫn**: `/bang-cap` -> Tab "Thông Tin Văn Bằng"

Quản lý chi tiết từng bằng tốt nghiệp của sinh viên:

**Thông Tin Mặc Định** (5 trường chuẩn):
- Số Vào Sổ (auto-increment, không chỉnh sửa)
- Số Hiệu Văn Bằng
- Mã Sinh Viên (MSV)
- Họ Tên
- Ngày Sinh

**Thông Tin Bổ Sung**:
- Lấy từ cấu hình biểu mẫu (Dân tộc, Nơi sinh, Điểm TB, Ngày nhập học, etc.)
- Input control tương ứng với kiểu dữ liệu

**Thao Tác**:
- Thêm văn bằng mới:
  - Số vào sổ tự động tăng theo sổ văn bằng đã chọn
  - Nhập tất cả thông tin (mặc định + bổ sung)
  - Chọn sổ văn bằng và quyết định liên kết
- Chỉnh sửa (ngoài số vào sổ và số hiệu)
- Xóa

---

### 5. Tra Cứu Văn Bằng
**Đường dẫn**: `/bang-cap` -> Tab "Tra Cứu Văn Bằng"

Người dùng tra cứu thông tin văn bằng:

**Tham Số Tìm Kiếm** (Phải chọn ít nhất 2):
- Số Hiệu Văn Bằng
- Số Vào Sổ
- Mã Sinh Viên
- Họ Tên
- Ngày Sinh

**Chức Năng**:
- Nhập ít nhất 2 tham số để tìm kiếm
- Hiển thị kết quả phù hợp
- Xem chi tiết từng bằng
- Xem chi tiết quyết định tương ứng

**Ghi Nhận Tra Cứu**:
- Tự động ghi nhận mỗi lần tra cứu theo quyết định
- Tab "Thống Kê Tra Cứu" hiển thị:
  - Số Quyết Định
  - Trích Yếu
  - Tổng Số Lượt Tra Cứu (theo quyết định)

---

## Quy Trình Sử Dụng

### Quy Trình Toàn Bộ:

1. **Chuẩn Bị** (Admin):
   - Truy cập tab "Cấu Hình Biểu Mẫu"
   - Thêm các trường thông tin cần theo dõi (Dân tộc, Điểm TB, etc.)

2. **Bắt Đầu Năm Học**:
   - Truy cập tab "Sổ Văn Bằng"
   - Tạo sổ mới cho năm (số vào sổ reset về 1)

3. **Quản Lý Đợt Tốt Nghiệp**:
   - Tạo quyết định mới cho mỗi đợt
   - Liên kết với sổ văn bằng của năm đó

4. **Nhập Dữ Liệu**:
   - Truy cập tab "Thông Tin Văn Bằng"
   - Thêm thông tin các sinh viên tốt nghiệp
   - Số vào sổ tự động tăng, chọn quyết định tương ứng

5. **Tra Cứu** (Người dùng):
   - Truy cập tab "Tra Cứu Văn Bằng"
   - Nhập ít nhất 2 tham số tìm kiếm
   - Xem thông tin chi tiết + quyết định

6. **Kết Thúc Năm**:
   - Đóng sổ văn bằng của năm
   - Thời điểm này không thêm được văn bằng mới

---

## Lưu Trữ Dữ Liệu

Tất cả dữ liệu được lưu trữ trong **localStorage** trình duyệt:
- `van_bang_register_data`: Sổ văn bằng
- `quyet_dinh_data`: Quyết định
- `form_config_data`: Cấu hình biểu mẫu
- `van_bang_data`: Thông tin văn bằng
- `van_bang_lookup_data`: Ghi nhận tra cứu

**Lưu Ý**: Dữ liệu sẽ mất nếu xóa cache trình duyệt. Để sử dụng lâu dài, cần migrate sang cơ sở dữ liệu thật.

---

## Hạn Chế & Ghi Chú

1. **Số Vào Sổ**: Không cho phép chỉnh sửa sau khi tạo (đảm bảo tính toàn vẹn)
2. **Quyết Định**: Phải có sổ văn bằng trước
3. **Văn Bằng**: Phải cấu hình biểu mẫu trước khi thêm
4. **Tra Cứu**: Cần ít nhất 2 tham số (tránh kết quả quá nhiều)
5. **Thống Kê**: Chỉ ghi nhận tra cứu từ tab "Tra Cứu", không ghi nhận từ "Thông Tin Văn Bằng"

---

## API Models

Ứng dụng sử dụng 5 custom hooks từ `@/models/bangcap`:

1. **useVanBangRegisterModel()**: Quản lý sổ văn bằng
2. **useQuyetDinhModel()**: Quản lý quyết định
3. **useFormConfigModel()**: Quản lý cấu hình biểu mẫu
4. **useVanBangModel()**: Quản lý thông tin văn bằng
5. **useVanBangLookupModel()**: Ghi nhận tra cứu

Xem chi tiết API trong các file model: `src/models/bangcap/`

---

## Để Phát Triển Thêm

### Nâng Cấp Cơ Sở Dữ Liệu:
Thay thế localStorage bằng API backend:
- Tạo endpoints: GET, POST, PUT, DELETE cho mỗi resource
- Update hooks để call API thay vì localStorage

### Thêm Tính Năng:
- Export/Import dữ liệu (Excel, PDF)
- Báo cáo thống kê theo năm
- Ký điện tử văn bằng
- QR code tra cứu

### Bảo Mật:
- Xác thực người dùng (login)
- Phân quyền (Admin, Người dùng)
- Audit log (ghi nhận mọi thay đổi)
