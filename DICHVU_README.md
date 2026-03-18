# Hệ Thống Quản Lý Lịch Hẹn Dịch Vụ (DichVu Management System)

## 📋 Tổng Quan

Đây là một ứng dụng web toàn diện để quản lý lịch hẹn cho các dịch vụ như cắt tóc, spa, khám bệnh, sửa chữa, v.v.

## 🎯 Chức Năng Chính

### 1. **Quản Lý Dịch Vụ** 📚
- Thêm/Sửa/Xóa dịch vụ
- Quản lý giá, thời gian thực hiện
- Phân loại dịch vụ
- Thiết lập độ ưu tiên hiển thị

### 2. **Quản Lý Nhân Viên** 👥
- Thêm/Sửa/Xóa nhân viên
- Quản lý chuyên môn (dịch vụ mà nhân viên có thể làm)
- Thiết lập số khách tối đa/ngày
- Quản lý lịch làm việc (Thứ 2-Chủ nhật)
- Theo dõi điểm đánh giá

### 3. **Quản Lý Lịch Hẹn** 📅
- Đặt lịch hẹn (chọn ngày, giờ, nhân viên, dịch vụ)
- Kiểm tra va chạm tự động (tránh đặt trùng lịch)
- Quản lý trạng thái lịch hẹn:
  - ⏳ **Chờ duyệt**
  - ✅ **Xác nhận**
  - ✔️ **Hoàn thành**
  - ❌ **Hủy**
- Quản lý thanh toán (tiền mặt, card, chuyển khoản)

### 4. **Đánh Giá & Phản Hồi** ⭐
- Khách hàng đánh giá nhân viên sau khi hoàn thành dịch vụ
- Nhân viên có thể phản hồi lại đánh giá
- Hiển thị điểm đánh giá trung bình
- Lưu lịch sử đánh giá

### 5. **Thống Kê & Báo Cáo** 📊
- Thống kê doanh thu (tổng, theo dịch vụ, theo nhân viên)
- Thống kê số lượng lịch hẹn (theo ngày, tháng)
- Phân tích hiệu suất nhân viên
- Biểu đồ doanh thu theo thời gian

## 📁 Cấu Trúc Project

```
src/
├── models/dichvu/
│   ├── nhanvien.ts       - Model nhân viên + hook useNhanVienModel
│   ├── dichvu.ts         - Model dịch vụ + hook useDichVuModel
│   ├── lichhen.ts        - Model lịch hẹn + hook useLichHenModel
│   ├── danhgia.ts        - Model đánh giá + hook useDanhGiaModel
│   └── index.ts          - Export tất cả
│
├── services/DichVu/
│   └── index.ts          - API endpoints
│
└── pages/DichVu/
    ├── index.tsx         - Trang chính (menu điều hướng)
    ├── index.less        - Styling
    │
    ├── NhanVien/
    │   └── index.tsx     - Quản lý nhân viên
    │
    ├── DichVu/
    │   ├── index.tsx     - Quản lý dịch vụ
    │   ├── DanhGia.ts    - Quản lý đánh giá
    │   └── LichHen.tsx   - Re-export từ DatLichHen
    │
    ├── DatLichHen/
    │   └── index.tsx     - Đặt & quản lý lịch hẹn
    │
    ├── ThongKe/
    │   └── index.tsx     - Thống kê & báo cáo
    │
    └── components/
        ├── LichHenCalendar.tsx      - Calendar hiển thị lịch hẹn
        ├── LichLamViecEditor.tsx    - Editor lịch làm việc nhân viên
        └── NhanVienCard.tsx         - Card hiển thị thông tin nhân viên
```

## 🚀 Cách Sử Dụng

### Khởi Động
```bash
npm run dev
# Hoặc
npm start
```

Truy cập: `http://localhost:8000/dichvu`

### Quy Trình Cơ Bản

#### 1️⃣ **Thiết Lập Dịch Vụ**
- Đi tới tab **Dịch vụ**
- Nhấn **Thêm dịch vụ**
- Nhập: tên, giá, thời gian thực hiện, loại dịch vụ
- Lưu

#### 2️⃣ **Thêm Nhân Viên**
- Đi tới tab **Nhân viên**
- Nhấn **Thêm nhân viên**
- Nhập: họ tên, email, SĐT, chuyên môn (chọn dịch vụ)
- Nhập: số khách tối đa/ngày, trạng thái
- Lưu

#### 3️⃣ **Đặt Lịch Hẹn**
- Đi tới tab **Lịch hẹn**
- Nhấn **Đặt lịch hẹn**
- Nhập: thông tin khách hàng, dịch vụ, nhân viên, ngày giờ
- Hệ thống sẽ kiểm tra va chạm tự động
- Lưu → Trạng thái: "Chờ duyệt"

#### 4️⃣ **Quản Lý Lịch Hẹn**
- Xác nhận lịch hẹn → Trạng thái: "Xác nhận"
- Hoàn thành lịch hẹn → Trạng thái: "Hoàn thành"
- Hủy lịch hẹn → Trạng thái: "Hủy" + ghi lý do

#### 5️⃣ **Đánh Giá**
- Sau khi hoàn thành lịch hẹn, đi tới tab **Đánh giá**
- Nhấn **Thêm đánh giá**
- Chọn lịch hẹn (nếu có), nhập: điểm 1-5⭐, tiêu đề, nhận xét
- Nhân viên sẽ nhận được điểm trung bình tự động cập nhật

#### 6️⃣ **Xem Thống Kê**
- Đi tới tab **Thống kê**
- Xem: doanh thu, số lượng lịch hẹn, hiệu suất nhân viên
- Có thể lọc theo tháng/năm

## 📊 Data Storage

Ứng dụng sử dụng **localStorage** để lưu trữ dữ liệu:
- `nhanvien_data` - Dữ liệu nhân viên
- `dichvu_data` - Dữ liệu dịch vụ
- `lichhen_data` - Dữ liệu lịch hẹn
- `danhgia_data` - Dữ liệu đánh giá

## 🔧 Custom Hooks

### useNhanVienModel()
```typescript
const {
  nhanViens,           // Mảng nhân viên
  addNhanVien,         // Thêm nhân viên
  updateNhanVien,      // Cập nhật nhân viên
  deleteNhanVien,      // Xóa nhân viên
  getNhanVienById,     // Lấy nhân viên theo ID
  getNhanVienByChuyenMon, // Lấy nhân viên theo dịch vụ
  setDiemNhanVien,     // Cập nhật điểm đánh giá
} = useNhanVienModel();
```

### useDichVuModel()
```typescript
const {
  dichVus,             // Mảng dịch vụ
  addDichVu,           // Thêm dịch vụ
  updateDichVu,        // Cập nhật dịch vụ
  deleteDichVu,        // Xóa dịch vụ
  getDichVuById,       // Lấy dịch vụ theo ID
  getDichVuByLoai,     // Lấy dịch vụ theo loại
  getDichVuActive,     // Lấy dịch vụ hoạt động
} = useDichVuModel();
```

### useLichHenModel()
```typescript
const {
  lichHens,                    // Mảng lịch hẹn
  addLichHen,                  // Thêm lịch hẹn
  updateTrangThaiLichHen,      // Cập nhật trạng thái
  getLichHenById,              // Lấy lịch hẹn theo ID
  getLichHenByNhanVienVaNgay,  // Lấy lịch hẹn theo NV và ngày
  kiemTraLichTrung,            // Kiểm tra va chạm
  huyLichHen,                  // Hủy lịch hẹn
  getLichHenTheoTrangThai,     // Lấy lịch hẹn theo trạng thái
} = useLichHenModel();
```

### useDanhGiaModel()
```typescript
const {
  danhGias,                // Mảng đánh giá
  addDanhGia,              // Thêm đánh giá
  getDanhGiaByNhanVien,    // Lấy đánh giá của nhân viên
  phanHoiDanhGia,          // Phản hồi đánh giá
  getDiemTrungBinhNhanVien,// Lấy điểm TB của nhân viên
} = useDanhGiaModel();
```

## 🎨 UI Components Sử Dụng

- **Ant Design**: Button, Table, Modal, Form, Input, Select, Card, Calendar, Rating, Statistic, Badge, Tag, Progress, Row, Col, Space, Tooltip
- **Icons**: Ant Design Icons
- **Date**: dayjs

## 📝 Công Thức Tính Toán

### Điểm Đánh Giá Trung Bình
```
Điểm mới = (Điểm cũ × Số đánh giá + Điểm mới) / (Số đánh giá + 1)
```

### Kiểm Tra Va Chạm Lịch Hẹn
```
Nếu: start1 < end2 AND end1 > start2 → Va chạm
```

### Thống Kê Doanh Thu
```
Doanh thu = Tổng tiền thanh toán của lịch hẹn hoàn thành
```

## 🔐 Quản Lý Quyền (Tương Lai)

Hiện tại chưa triển khai, nhưng có cấu trúc sẵn:
- `nhân viên`: Xem lịch của mình, nhập đánh giá
- `trưởng nhóm`: Quản lý nhân viên, thống kê
- `admin`: Toàn quyền

## 🐛 Debug & Troubleshooting

### Dữ liệu không hiển thị
- Mở **DevTools → Application → LocalStorage**
- Kiểm tra các key: `nhanvien_data`, `dichvu_data`, v.v.
- Xóa cache và làm mới trang

### Lịch hẹn va chạm
- Kiểm tra lịch hẹn hiện tại trong tab **Lịch hẹn**
- Hệ thống tự động kiểm tra khi đặt lịch
- Hủy lịch cũ nếu cần

## 📌 Tính Năng Tương Lai

- [ ] Tích hợp với backend API thực
- [ ] Xác thực người dùng (login/logout)
- [ ] Gửi email/SMS thông báo lịch hẹn
- [ ] Export báo cáo PDF/Excel
- [ ] Biểu đồ thống kê advanced (Chart.js)
- [ ] Mobile app responsive
- [ ] Lồng ghép thanh toán online (VNPay, Stripe)
- [ ] Hệ thống quản lý quyền chi tiết
- [ ] Backup & restore dữ liệu
- [ ] Tính năng review công khai

## 📖 Tham Khảo

- [Ant Design Documentation](https://ant.design)
- [Dayjs Documentation](https://day.js.org)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Developer**: AI Assistant
