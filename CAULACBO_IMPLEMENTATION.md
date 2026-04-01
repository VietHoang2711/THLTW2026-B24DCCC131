# Hệ thống Quản lý Câu lạc bộ - Tài liệu Triển khai

## Tổng quan

Hệ thống Quản lý Câu lạc bộ là một giải pháp toàn diện để quản lý các câu lạc bộ, đơn đăng ký thành viên, quản lý thành viên và báo cáo thống kê nâng cao.

## Cấu trúc Dự án

```
src/
├── models/caulacbo/
│   ├── caulacbo.ts          # Định nghĩa types
│   └── index.ts             # Export models
├── services/CauLacBo/
│   └── index.ts             # API endpoints
└── pages/CauLacBo/
    ├── index.tsx            # Main page (wrapper)
    ├── DanhSachCauLacBo.tsx # Danh sách CLB
    ├── QuanLyDonDangKy.tsx  # Quản lý đơn đăng ký
    ├── QuanLyThanhVien.tsx  # Quản lý thành viên
    ├── ThongKe.tsx          # Báo cáo thống kê
    ├── components/
    │   ├── ModalCauLacBo.tsx      # Form thêm/sửa CLB
    │   ├── ModalViewMembers.tsx   # Xem thành viên CLB
    │   ├── ModalDonDangKy.tsx     # Form đơn đăng ký
    │   └── ModalLichSu.tsx        # Xem lịch sử thao tác
    └── index.less           # Styling
```

## Các Types/Models

### 1. CauLacBo (Câu lạc bộ)
```typescript
interface CauLacBo {
  id: string;
  tenCauLacBo: string;           // Tên câu lạc bộ
  anhDaiDien: string;            // URL ảnh đại diện
  ngayThanhLap: string;          // Ngày thành lập (ISO date)
  moTa: string;                  // Mô tả (HTML)
  chuNhiemCLB: string;           // Chủ nhiệm CLB
  hoatDong: boolean;             // Có/Không hoạt động
  trangThai: 'active' | 'inactive';
  ngayTao: string;
  ngayCapNhat: string;
}
```

### 2. DonDangKyThanhVien (Đơn đăng ký)
```typescript
interface DonDangKyThanhVien {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: 'nam' | 'nu' | 'khac';
  diaChi: string;
  soTruong: string;
  caulacboId: string;            // ID câu lạc bộ
  lyDoDangKy: string;
  trangThai: 'pending' | 'approved' | 'rejected';
  ghiChu: string;                // Lý do từ chối
  ngayDangKy: string;
  ngayCapNhat: string;
}
```

### 3. LichSuThaoTac (Lịch sử thao tác)
```typescript
interface LichSuThaoTac {
  id: string;
  donDangKyId: string;
  hanhDong: 'approved' | 'rejected';
  nguoiThaoTac: string;          // Admin name
  thoiDiem: string;              // ISO datetime
  lyDo: string;
  ghiChu: string;
}
```

## API Endpoints

### Câu lạc bộ
- `GET /api/caulacbo/list` - Lấy danh sách CLB
- `GET /api/caulacbo/{id}` - Lấy chi tiết CLB
- `POST /api/caulacbo` - Thêm CLB
- `PUT /api/caulacbo/{id}` - Cập nhật CLB
- `DELETE /api/caulacbo/{id}` - Xóa CLB

### Đơn đăng ký
- `GET /api/caulacbo/dongangky` - Lấy danh sách đơn
- `GET /api/caulacbo/dongangky/{id}` - Lấy chi tiết đơn
- `POST /api/caulacbo/dongangky` - Thêm đơn
- `PUT /api/caulacbo/dongangky/{id}` - Cập nhật đơn
- `DELETE /api/caulacbo/dongangky/{id}` - Xóa đơn
- `PATCH /api/caulacbo/dongangky/{id}/approve` - Duyệt đơn
- `PATCH /api/caulacbo/dongangky/{id}/reject` - Từ chối đơn
- `PATCH /api/caulacbo/dongangky/approve-multiple` - Duyệt nhiều đơn
- `PATCH /api/caulacbo/dongangky/reject-multiple` - Từ chối nhiều đơn

### Lịch sử
- `GET /api/caulacbo/lichsu?donDangKyId={id}` - Lấy lịch sử thao tác
- `POST /api/caulacbo/lichsu` - Thêm lịch sử

### Thành viên
- `GET /api/caulacbo/thanhvien/{caulacboId}` - Lấy thành viên của CLB
- `PATCH /api/caulacbo/thanhvien/change-club` - Chuyển thành viên sang CLB khác

### Thống kê
- `GET /api/caulacbo/thongke/tongquan` - Tổng quan thống kê
- `GET /api/caulacbo/thongke/thecaulacbo` - Thống kê theo CLB

## Tính năng Chi tiết

### Tab 1: Danh sách Câu lạc bộ
- **Hiển thị**: Bảng câu lạc bộ gồm Ảnh, Tên, Ngày thành lập, Chủ nhiệm, Mô tả, Hoạt động
- **Thao tác**: Thêm, Sửa, Xóa, Xem danh sách thành viên
- **Tìm kiếm**: Tìm theo tên hoặc chủ nhiệm

**Features:**
- Upload ảnh đại diện
- Nhập mô tả bằng HTML editor (TinyMCE)
- Đánh dấu trạng thái hoạt động

### Tab 2: Quản lý Đơn đăng ký
- **Hiển thị**: Bảng ứng viên với tất cả thông tin
- **Thao tác**: Xem chi tiết, Chỉnh sửa, Xóa, Duyệt (single/multiple), Từ chối (single/multiple)
- **Tìm kiếm**: Tìm theo tên, email, SĐT
- **Lọc**: Theo trạng thái (Pending, Approved, Rejected)

**Features:**
- Xem lịch sử thao tác cho từng đơn
- Duyệt/Từ chối multiple với checkbox selection
- Bắt buộc nhập lý do khi từ chối
- Tự động lưu lịch sử thao tác

### Tab 3: Quản lý Thành viên
- **Hiển thị**: Danh sách thành viên (chỉ những có trạng thái Approved)
- **Thao tác**: Chuyển thành viên sang CLB khác (single/multiple)
- **Tìm kiếm**: Tìm theo tên, email, SĐT
- **Lọc**: Theo câu lạc bộ

**Features:**
- Modal xác nhận khi chuyển CLB
- Hiển thị số lượng thành viên được chuyển

### Tab 4: Báo cáo & Thống kê
**Hiển thị:**
1. **Thẻ toàn quan** (4 thẻ):
   - Tổng số CLB
   - Tổng số đơn đăng ký
   - Số đơn chưa duyệt
   - Số đơn đã duyệt

2. **Biểu đồ cột** (ApexCharts):
   - X-axis: Tên câu lạc bộ
   - Y-axis: 3 cột tương ứng (Chưa duyệt, Đã duyệt, Từ chối)

3. **Bảng chi tiết**: 
   - Câu lạc bộ, Chưa duyệt, Đã duyệt, Từ chối, Tổng cộng

## Hướng dẫn Sử dụng

### 1. Thêm Câu lạc bộ
1. Vào Tab "Danh sách Câu lạc bộ"
2. Click nút "Thêm Câu lạc bộ"
3. Điền thông tin:
   - Tên câu lạc bộ
   - Chủ nhiệm CLB
   - Ngày thành lập
   - Chọn ảnh đại diện
   - Nhập mô tả (hỗ trợ HTML)
   - Đánh dấu "Hoạt động" nếu cần
4. Click "Thêm"

### 2. Quản lý Đơn đăng ký
1. Vào Tab "Quản lý Đơn đăng ký"
2. **Duyệt đơn**:
   - Click nút "Duyệt" hoặc
   - Chọn nhiều đơn rồi click "Duyệt xx đơn"
3. **Từ chối đơn**:
   - Click nút "Từ chối" (bắt buộc nhập lý do) hoặc
   - Chọn nhiều đơn rồi click "Từ chối xx đơn"
4. **Xem lịch sử**: Click nút "Lịch sử" để xem các thao tác trước đó

### 3. Chuyển Thành viên sang CLB khác
1. Vào Tab "Quản lý Thành viên"
2. Lọc theo CLB (nếu cần)
3. Chọn các thành viên cần chuyển (checkbox)
4. Chọn CLB đích từ dropdown
5. Click nút "Chuyển xx thành viên"
6. Xác nhận trong modal

### 4. Xem Báo cáo
1. Vào Tab "Báo cáo & Thống kê"
2. Xem các thẻ toàn quan ở trên cùng
3. Xem biểu đồ cột và bảng chi tiết

## Import và Sử dụng trong URL Routes

Thêm page vào `config/routes.ts`:

```typescript
{
  path: '/caulacbo',
  name: 'Câu lạc bộ',
  icon: 'TeamOutlined',
  component: './CauLacBo',
}
```

## Dependencies Cần thiết

Các thư viện đã có sẵn trong project:
- antd (4.21.0) - UI Components
- react - Framework
- axios - HTTP Client
- @tinymce/tinymce-react - HTML Editor
- react-apexcharts - Biểu đồ

## Lưu ý Triển khai

1. **Upload File**: Sử dụng `buildUpLoadFile` từ `@/services/uploadFile` để upload ảnh
2. **HTML Editor**: Sử dụng component `TinyEditor` cho mô tả CLB
3. **API Calls**: Tất cả các hàm API được định nghĩa trong `@/services/CauLacBo`
4. **Styling**: CSS được viết trong `index.less` với class `caulacbo-page`
5. **Responsive**: Sử dụng Ant Design Grid System cho responsive design

## Development Tips

### Thêm tính năng mới
1. Tạo component mới trong `components/`
2. Export từ component cha
3. Thêm API endpoint tương ứng

### Debugging
- Component state được quản lý bằng `useState`
- Sử dụng `message` từ antd để hiển thị notification
- Dùng `Spin` để show loading state

### Styling
- Sử dụng LESS cho styling
- Kế thừa class `caulacbo-page` cho styling chung
- Tận dụng utility classes từ Ant Design

## Troubleshooting

### Modal không hiển thị
- Kiểm tra prop `visible` có bằng true không
- Kiểm tra modal component có được import không

### Data không load
- Kiểm tra API endpoint có đúng không
- Kiểm tra response data structure

### Upload ảnh không hoạt động
- Kiểm tra `EFileScope` và endpoint upload
- Kiểm tra file size và format

## Contact & Support

Để tìm hiểu thêm hoặc báo lỗi, vui lòng liên hệ với team development.
