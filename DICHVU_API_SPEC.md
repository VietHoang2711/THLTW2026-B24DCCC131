# API Specification cho DichVu Module

## Base URL
```
/api/dichvu
```

## Authentication
Tất cả endpoints cần header:
```
Authorization: Bearer <token>
```

---

## 1. Nhân Viên (NhanVien)

### 1.1 Lấy danh sách nhân viên
```
GET /api/dichvu/nhanvien
```

**Query Parameters:**
- `status`: hoat_dong|tam_ngung|nghi_phep (optional)
- `specialization`: service_id (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "nv001",
      "hoTen": "Nguyễn Thị Hoa",
      "email": "hoa@example.com",
      "soDienThoai": "0901234567",
      "chuyenMon": ["sv001", "sv002"],
      "soKhachToiDa": 5,
      "diem": 4.8,
      "quantamDanhGia": 25,
      "trangThai": "hoat_dong",
      "ngayThamGia": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

### 1.2 Lấy thông tin nhân viên
```
GET /api/dichvu/nhanvien/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* NhanVien object */ }
}
```

### 1.3 Tạo nhân viên
```
POST /api/dichvu/nhanvien
Content-Type: application/json

{
  "hoTen": "Nguyễn Văn A",
  "email": "a@example.com",
  "soDienThoai": "0912345678",
  "chuyenMon": ["sv001", "sv002"],
  "soKhachToiDa": 5,
  "trangThai": "hoat_dong"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "nv_new_id",
    "hoTen": "Nguyễn Văn A",
    ...
  }
}
```

### 1.4 Cập nhật nhân viên
```
PUT /api/dichvu/nhanvien/:id
Content-Type: application/json

{
  "hoTen": "Nguyễn Văn A (Updated)",
  "soDienThoai": "0912345679",
  "soKhachToiDa": 6,
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Updated NhanVien object */ }
}
```

### 1.5 Xóa nhân viên
```
DELETE /api/dichvu/nhanvien/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Nhân viên đã được xóa"
}
```

### 1.6 Cập nhật lịch làm việc
```
PATCH /api/dichvu/nhanvien/:id/schedule
Content-Type: application/json

{
  "schedule": [
    {
      "thu": 2,
      "thoiGianBatDau": "09:00",
      "thoiGianKetThuc": "17:00",
      "loai": "thuong"
    },
    ...
  ]
}
```

---

## 2. Dịch Vụ (DichVu)

### 2.1 Lấy danh sách dịch vụ
```
GET /api/dichvu/dichvu?page=1&limit=20&status=hoat_dong
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sv001",
      "tenDichVu": "Cắt tóc nam cơ bản",
      "moTa": "Cắt tóc nam theo kiểu đơn giản",
      "gia": 50000,
      "thoiGianThucHien": 20,
      "loaiDichVu": "cat_toc",
      "hinh": "https://...",
      "trangThai": "hoat_dong",
      "trongSoUuTien": 8
    }
  ],
  "total": 5
}
```

### 2.2 Lấy thông tin dịch vụ
```
GET /api/dichvu/dichvu/:id
```

### 2.3 Tạo dịch vụ
```
POST /api/dichvu/dichvu
Content-Type: application/json

{
  "tenDichVu": "Spa facial",
  "moTa": "Spa mặt theo công thức Nhật",
  "gia": 200000,
  "thoiGianThucHien": 60,
  "loaiDichVu": "spa",
  "hinh": "https://...",
  "trangThai": "hoat_dong",
  "trongSoUuTien": 9
}
```

### 2.4 Cập nhật dịch vụ
```
PUT /api/dichvu/dichvu/:id
```

### 2.5 Xóa dịch vụ
```
DELETE /api/dichvu/dichvu/:id
```

---

## 3. Lịch Hẹn (LichHen)

### 3.1 Lấy danh sách lịch hẹn
```
GET /api/dichvu/lichhen?page=1&limit=20&status=xac_nhan&ngayBatDau=2024-03-01&ngayKetThuc=2024-03-31
```

**Query Parameters:**
- `nhanVienId`: string (optional)
- `status`: cho_duyet|xac_nhan|hoan_thanh|huy (optional)
- `ngayBatDau`: YYYY-MM-DD (optional)
- `ngayKetThuc`: YYYY-MM-DD (optional)
- `khachHangId`: string (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lh001",
      "khachHangTen": "Trần Văn A",
      "khachHangSDT": "0909000001",
      "khachHangEmail": "vana@example.com",
      "nhanVienId": "nv001",
      "dichVuId": "sv001",
      "ngayHen": "2024-03-20T00:00:00.000Z",
      "thoiGianBatDau": "09:00",
      "thoiGianKetThuc": "09:20",
      "ghiChu": "Cắt kiểu cổ điển",
      "trangThai": "xac_nhan",
      "tienThanhToan": 50000,
      "phuongThucThanhToan": "tien_mat"
    }
  ],
  "total": 100
}
```

### 3.2 Lấy thông tin lịch hẹn
```
GET /api/dichvu/lichhen/:id
```

### 3.3 Tạo lịch hẹn
```
POST /api/dichvu/lichhen
Content-Type: application/json

{
  "khachHangTen": "Nguyễn Văn B",
  "khachHangSDT": "0909000002",
  "khachHangEmail": "vanb@example.com",
  "nhanVienId": "nv001",
  "dichVuId": "sv001",
  "ngayHen": "2024-03-25",
  "thoiGianBatDau": "10:00",
  "ghiChu": "Yêu cầu cắt ngắn",
  "phuongThucThanhToan": "card"
}
```

**Validation:**
- Kiểm tra `nhanVienId` được phân công cho `dichVuId`
- Kiểm tra lịch không trùng
- Kiểm tra nhân viên không quá số khách tối đa

**Response:**
```json
{
  "success": true,
  "data": { /* LichHen object with id */ },
  "message": "Lịch hẹn được tạo, chờ xác nhận"
}
```

### 3.4 Cập nhật trạng thái lịch hẹn
```
PATCH /api/dichvu/lichhen/:id/status
Content-Type: application/json

{
  "trangThai": "xac_nhan"
}
```

**Valid Transitions:**
```
cho_duyet → xac_nhan
xac_nhan → hoan_thanh
Any → huy
```

### 3.5 Hủy lịch hẹn
```
PATCH /api/dichvu/lichhen/:id/cancel
Content-Type: application/json

{
  "lyDo": "Khách hàng yêu cầu hủy"
}
```

### 3.6 Kiểm tra va chạm lịch
```
POST /api/dichvu/lichhen/check-conflict
Content-Type: application/json

{
  "nhanVienId": "nv001",
  "ngayHen": "2024-03-25",
  "thoiGianBatDau": "10:00",
  "thoiGianKetThuc": "10:30"
}
```

**Response:**
```json
{
  "success": true,
  "conflict": false,
  "message": "Không có va chạm"
}
```

---

## 4. Đánh Giá (DanhGia)

### 4.1 Lấy danh sách đánh giá
```
GET /api/dichvu/danhgia?nhanVienId=nv001&page=1&limit=20
```

**Query Parameters:**
- `nhanVienId`: string (optional)
- `lichHenId`: string (optional)
- `minDiem`: number (optional)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dg001",
      "lichHenId": "lh001",
      "nhanVienId": "nv001",
      "khachHangTen": "Trần Văn A",
      "diem": 5,
      "tieuDe": "Dịch vụ xuất sắc",
      "nhanXet": "Nhân viên rất chuyên nghiệp",
      "trangThaiPhanHoi": "da_phan_hoi",
      "ngayDanhGia": "2024-03-21T00:00:00.000Z"
    }
  ],
  "total": 25
}
```

### 4.2 Tạo đánh giá
```
POST /api/dichvu/danhgia
Content-Type: application/json

{
  "lichHenId": "lh001",
  "khachHangTen": "Trần Văn A",
  "diem": 5,
  "tieuDe": "Dịch vụ tuyệt vời",
  "nhanXet": "Nhân viên chuyên nghiệp, cắt tóc đẹp",
  "anhDinhKem": ["https://...", "https://..."]
}
```

**Validation:**
- `lichHenId` phải tồn tại và status = "hoan_thanh"
- Mỗi lịch hẹn chỉ được đánh giá 1 lần
- `diem` từ 1-5
- `nhanXet` tối thiểu 10 ký tự

**Response:**
```json
{
  "success": true,
  "data": { /* DanhGia object */ }
}
```

### 4.3 Phản hồi đánh giá
```
PATCH /api/dichvu/danhgia/:id/reply
Content-Type: application/json

{
  "phanHoi": "Cảm ơn bạn đã đánh giá cao dịch vụ của chúng tôi!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dg001",
    "phanHoiNhanVien": "Cảm ơn bạn...",
    "trangThaiPhanHoi": "da_phan_hoi",
    "ngayCapNhat": "2024-03-21T15:30:00.000Z"
  }
}
```

### 4.4 Lấy điểm trung bình nhân viên
```
GET /api/dichvu/nhanvien/:id/rating
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nhanVienId": "nv001",
    "diemTrungBinh": 4.8,
    "soLuongDanhGia": 25,
    "diemThapNhat": 4,
    "diemCaoNhat": 5
  }
}
```

---

## 5. Thống Kê (ThongKe)

### 5.1 Doanh thu
```
GET /api/dichvu/thongke/doanhthu?startDate=2024-03-01&endDate=2024-03-31&loai=tong|dichvu|nhanvien
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tongDoanhThu": 5000000,
    "chiTiet": [
      {
        "ten": "Cắt tóc",
        "doanhThu": 1500000,
        "soLuong": 30
      }
    ]
  }
}
```

### 5.2 Lịch hẹn
```
GET /api/dichvu/thongke/lichhen?startDate=2024-03-01&endDate=2024-03-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tongLichHen": 150,
    "dichoDuyet": 10,
    "daXacNhan": 80,
    "daHoanThanh": 55,
    "daHuy": 5
  }
}
```

### 5.3 Hiệu suất nhân viên
```
GET /api/dichvu/thongke/nhanvien?startDate=2024-03-01&endDate=2024-03-31
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "nhanVienId": "nv001",
      "hoTen": "Nguyễn Thị Hoa",
      "soLichHen": 45,
      "doanhThu": 2250000,
      "diemDanhGia": 4.8,
      "hieuSuat": 90
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "hoTen",
        "message": "Yêu cầu trường này"
      }
    ]
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Nhân viên không tìm thấy"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Lịch hẹn trùng với lịch hiện có"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Có lỗi xảy ra trên server"
  }
}
```

---

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1679850000
```

---

## Caching Headers

```
Cache-Control: no-cache, no-store, must-revalidate
ETag: "abc123..."
Last-Modified: Wed, 15 Mar 2024 10:30:00 GMT
```

---

**Version**: 1.0.0  
**Last Updated**: March 2026
