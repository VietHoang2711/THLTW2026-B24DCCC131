# Cấu Trúc Dữ Liệu (Data Models)

## 1. NhanVien (Nhân Viên)

```typescript
interface LichLamViec {
  thu: number;              // 1-7 (Chủ nhật đến Thứ 7)
  thoiGianBatDau: string;  // "09:00" (HH:mm)
  thoiGianKetThuc: string; // "17:00" (HH:mm)
  loai: 'thuong' | 'ngay_nghi';
}

interface TaiKhoanNhanVien {
  id: string;
  email: string;
  password: string;
  quyen: 'nhanvien' | 'truong_nhom' | 'admin';
}

interface NhanVien {
  id: string;                    // "nv001"
  hoTen: string;                 // "Nguyễn Thị Hoa"
  email: string;                 // "hoa@example.com"
  soDienThoai: string;           // "0901234567"
  chuyenMon: string[];           // ["sv001", "sv002"] (Service IDs)
  soKhachToiDa: number;          // 5 (khách/ngày)
  lichLamViec: Map<number, LichLamViec>; // {2: {...}, 3: {...}, ...}
  diem: number;                  // 4.8 (điểm đánh giá)
  quantamDanhGia: number;        // 25 (số lượng đánh giá)
  trangThai: 'hoat_dong' | 'tam_ngung' | 'nghi_phep';
  taiKhoan?: TaiKhoanNhanVien;
  ngayThamGia: string;           // ISO date string
  ngayCapNhat: string;           // ISO date string
}
```

### Ví dụ:
```json
{
  "id": "nv001",
  "hoTen": "Nguyễn Thị Hoa",
  "email": "hoa@example.com",
  "soDienThoai": "0901234567",
  "chuyenMon": ["sv001", "sv002"],
  "soKhachToiDa": 5,
  "lichLamViec": {
    "2": { "thu": 2, "thoiGianBatDau": "09:00", "thoiGianKetThuc": "17:00", "loai": "thuong" },
    "3": { "thu": 3, "thoiGianBatDau": "09:00", "thoiGianKetThuc": "17:00", "loai": "thuong" }
  },
  "diem": 4.8,
  "quantamDanhGia": 25,
  "trangThai": "hoat_dong",
  "ngayThamGia": "2024-01-15T00:00:00.000Z",
  "ngayCapNhat": "2024-03-18T10:30:00.000Z"
}
```

---

## 2. DichVu (Dịch Vụ)

```typescript
interface DichVu {
  id: string;                           // "sv001"
  tenDichVu: string;                    // "Cắt tóc nam cơ bản"
  moTa: string;                         // "Cắt tóc nam theo kiểu đơn giản"
  gia: number;                          // 50000 (VND)
  thoiGianThucHien: number;             // 20 (phút)
  loaiDichVu: 'cat_toc' | 'spa' | 'kham_benh' | 'sua_chua' | 'khac';
  hinh: string;                         // "https://..."
  trangThai: 'hoat_dong' | 'tam_ngung';
  trongSoUuTien: number;                // 1-10 (cao = ưu tiên)
  ngayTao: string;                      // ISO date string
  ngayCapNhat: string;                  // ISO date string
}
```

### Ví dụ:
```json
{
  "id": "sv001",
  "tenDichVu": "Cắt tóc nam cơ bản",
  "moTa": "Cắt tóc nam theo kiểu đơn giản",
  "gia": 50000,
  "thoiGianThucHien": 20,
  "loaiDichVu": "cat_toc",
  "hinh": "https://via.placeholder.com/200",
  "trangThai": "hoat_dong",
  "trongSoUuTien": 8,
  "ngayTao": "2024-01-01T00:00:00.000Z",
  "ngayCapNhat": "2024-03-18T10:30:00.000Z"
}
```

---

## 3. LichHen (Lịch Hẹn)

```typescript
type TrangThaiLichHen = 'cho_duyet' | 'xac_nhan' | 'hoan_thanh' | 'huy';

interface LichHen {
  id: string;                                    // "lh001"
  khachHangId: string;                           // "kh001"
  khachHangTen: string;                          // "Trần Văn A"
  khachHangSDT: string;                          // "0909000001"
  khachHangEmail: string;                        // "vana@example.com"
  nhanVienId: string;                            // "nv001"
  dichVuId: string;                              // "sv001"
  ngayHen: string;                               // ISO date "2024-03-20T00:00:00.000Z"
  thoiGianBatDau: string;                        // "09:00"
  thoiGianKetThuc: string;                       // "09:20"
  ghiChu: string;                                // "Cắt kiểu cổ điển"
  trangThai: TrangThaiLichHen;
  tienThanhToan: number;                         // 50000 (VND)
  phuongThucThanhToan: 'tien_mat' | 'card' | 'chuyen_khoan' | 'chua_thanh_toan';
  ngayTao: string;                               // ISO date string
  ngayCapNhat: string;                           // ISO date string
  danhGiaId?: string;                            // Link to DanhGia
}
```

### Trạng Thái Lịch Hẹn:
- **cho_duyet** (⏳): Vừa tạo, chờ duyệt
- **xac_nhan** (✅): Admin xác nhận, ready to go
- **hoan_thanh** (✔️): Hoàn thành dịch vụ
- **huy** (❌): Hủy vì lý do nào đó

### Ví dụ:
```json
{
  "id": "lh001",
  "khachHangId": "kh001",
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
  "phuongThucThanhToan": "tien_mat",
  "ngayTao": "2024-03-15T00:00:00.000Z",
  "ngayCapNhat": "2024-03-18T10:30:00.000Z"
}
```

---

## 4. DanhGia (Đánh Giá)

```typescript
interface DanhGia {
  id: string;                                    // "dg001"
  lichHenId: string;                             // "lh001"
  nhanVienId: string;                            // "nv001"
  khachHangId: string;                           // "kh001"
  khachHangTen: string;                          // "Trần Văn A"
  diem: number;                                  // 1-5
  tieuDe: string;                                // "Dịch vụ xuất sắc"
  nhanXet: string;                               // "Nhân viên rất chuyên nghiệp..."
  anhDinhKem: string[];                          // ["https://...", "https://..."]
  phanHoiNhanVien?: string;                      // "Cảm ơn bạn đã tin tưởng..."
  trangThaiPhanHoi: 'chua_phan_hoi' | 'da_phan_hoi';
  ngayDanhGia: string;                           // ISO date string
  ngayCapNhat: string;                           // ISO date string
}
```

### Ví dụ:
```json
{
  "id": "dg001",
  "lichHenId": "lh001",
  "nhanVienId": "nv001",
  "khachHangId": "kh001",
  "khachHangTen": "Trần Văn A",
  "diem": 5,
  "tieuDe": "Dịch vụ xuất sắc",
  "nhanXet": "Nhân viên rất chuyên nghiệp, cắt tóc đẹp và chuẩn",
  "anhDinhKem": [],
  "phanHoiNhanVien": "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!",
  "trangThaiPhanHoi": "da_phan_hoi",
  "ngayDanhGia": "2024-03-21T00:00:00.000Z",
  "ngayCapNhat": "2024-03-21T10:30:00.000Z"
}
```

---

## 5. localStorage Keys

Dữ liệu được lưu với các key:

```
nhanvien_data  → JSON Array of NhanVien[]
dichvu_data    → JSON Array of DichVu[]
lichhen_data   → JSON Array of LichHen[]
danhgia_data   → JSON Array of DanhGia[]
```

### Ví dụ localStorage:

```javascript
// Lấy dữ liệu
const nhanvienData = JSON.parse(localStorage.getItem('nhanvien_data'));

// Lưu dữ liệu
localStorage.setItem('nhanvien_data', JSON.stringify(nhanvienArray));

// Xóa dữ liệu
localStorage.removeItem('nhanvien_data');

// Clear all
localStorage.clear();
```

---

## 6. Quan Hệ Dữ Liệu

```
NhanVien (1) ------- (N) LichHen
   ├─ id ─────────────── nhanVienId
   └─ chuyenMon[] ──────▶ DichVu[]

DichVu (1) --------- (N) LichHen
   └─ id ─────────────── dichVuId

LichHen (1) -------- (1) DanhGia
   ├─ id ─────────────── lichHenId
   ├─ nhanVienId ──────▶ NhanVien
   └─ dichVuId ────────▶ DichVu

DanhGia (N) ─────── (1) NhanVien
   └─ nhanVienId ──────▶ NhanVien
```

---

## 7. Tính Toán & Công Thức

### A. Điểm Đánh Giá Trung Bình (Moving Average)

```
New Avg = (Old Avg × Count + New Score) / (Count + 1)

Ví dụ:
- NV hiện có: 4.5⭐ từ 20 đánh giá
- Khách mới đánh: 5⭐
- Điểm mới = (4.5 × 20 + 5) / (20 + 1) = 94.5 / 21 = 4.5⭐
```

### B. Kiểm Tra Va Chạm Lịch Hẹn

```
Công thức: start1 < end2 AND end1 > start2

Ví dụ:
- Lịch cũ: 09:00 - 09:30
- Lịch mới: 09:15 - 09:45
- start1 (09:15) < end2 (09:30)? ✓ TRUE
- end1 (09:45) > start2 (09:00)? ✓ TRUE
→ Va chạm! ❌
```

### C. Tính Doanh Thu

```
Doanh Thu Hôm Nay = Σ tienThanhToan (WHERE ngayHen = today AND trangThai = 'hoan_thanh')

Doanh Thu Theo Dịch Vụ = Σ tienThanhToan (WHERE dichVuId = X AND trangThai = 'hoan_thanh')

Doanh Thu Theo Nhân Viên = Σ tienThanhToan (WHERE nhanVienId = Y AND trangThai = 'hoan_thanh')
```

### D. Tính Hiệu Suất Nhân Viên

```
Hiệu Suất % = (Số Lịch Hẹn / (Số Khách Tối Đa × 30 Ngày)) × 100

Ví dụ:
- NV có 5 khách/ngày
- Tháng có 30 ngày
- Capacity = 5 × 30 = 150
- Nếu có 120 lịch hẹn
- Hiệu suất = (120 / 150) × 100 = 80%
```

---

## 8. Validation Rules

### NhanVien
- `hoTen`: Required, min length 3
- `email`: Required, valid email format
- `soDienThoai`: Required, valid phone format
- `chuyenMon`: Required, array not empty
- `soKhachToiDa`: Required, min 1, max 20
- `diem`: 0-5, decimal 1 place
- `lichLamViec`: thuỳ chọn time > startTime

### DichVu
- `tenDichVu`: Required, min length 3
- `gia`: Required, min 0
- `thoiGianThucHien`: Required, min 5, max 480 (phút)
- `loaiDichVu`: Required, enum value
- `trongSoUuTien`: 1-10
- `moTa`: Optional, max 500 characters

### LichHen
- `khachHangTen`: Required, min length 3
- `khachHangSDT`: Required, valid phone
- `khachHangEmail`: Optional, valid email if provided
- `nhanVienId`: Required, exists in NhanVien
- `dichVuId`: Required, exists in DichVu
- `ngayHen`: Required, >= today
- `thoiGianBatDau`: Required, valid time
- `thoiGianKetThuc`: Must be > thoiGianBatDau
- `kiemTraLichTrung`: Phải check không conflicts

### DanhGia
- `diem`: Required, 1-5
- `tieuDe`: Required, min length 5
- `nhanXet`: Required, min length 10
- `lichHenId`: Required, status = 'hoan_thanh'

---

## 9. Status Enums

```typescript
// Trạng thái nhân viên
type TrangThaiNhanVien = 'hoat_dong' | 'tam_ngung' | 'nghi_phep';

// Trạng thái dịch vụ
type TrangThaiDichVu = 'hoat_dong' | 'tam_ngung';

// Trạng thái lịch hẹn
type TrangThaiLichHen = 'cho_duyet' | 'xac_nhan' | 'hoan_thanh' | 'huy';

// Loại dịch vụ
type LoaiDichVu = 'cat_toc' | 'spa' | 'kham_benh' | 'sua_chua' | 'khac';

// Loại lịch làm việc
type LoaiLichLamViec = 'thuong' | 'ngay_nghi';

// Trạng thái phản hồi đánh giá
type TrangThaiPhanHoi = 'chua_phan_hoi' | 'da_phan_hoi';

// Phương thức thanh toán
type PhuongThucThanhToan = 'tien_mat' | 'card' | 'chuyen_khoan' | 'chua_thanh_toan';

// Quyền hạn
type Quyen = 'nhanvien' | 'truong_nhom' | 'admin';
```

---

**Version**: 1.0.0  
**Last Updated**: March 2026
