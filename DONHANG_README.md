# 📦 Hệ Thống Quản Lý Đơn Hàng

## Giới Thiệu

Hệ thống quản lý đơn hàng toàn diện cho cửa hàng online với đầy đủ các tính năng cần thiết từ tạo, chỉnh sửa, xóa đến theo dõi trạng thái đơn hàng.

---

## ✨ Các Tính Năng Chính

### 1. **Hiển Thị Danh Sách Đơn Hàng**

- Bảng danh sách hiển thị tất cả các thông tin quan trọng:
  - **Mã Đơn Hàng**: ID duy nhất của đơn (VD: DH001)
  - **Khách Hàng**: Tên người đặt hàng
  - **Ngày Đặt Hàng**: Thời gian tạo đơn hàng
  - **Tổng Tiền**: Tổng giá trị đơn hàng (định dạng tiền Việt)
  - **Trạng Thái**: Với 4 trạng thái chính:
    - 🟠 **Chờ xác nhận** (Màu cam)
    - 🔵 **Đang giao** (Màu xanh)
    - 🟢 **Hoàn thành** (Màu xanh lá)
    - 🔴 **Hủy** (Màu đỏ)

### 2. **Tìm Kiếm & Lọc Nâng Cao**

- **Tìm kiếm**: Tìm theo mã đơn hàng hoặc tên khách hàng
- **Lọc theo Trạng Thái**: Chọn lọc đơn hàng theo từng trạng thái cụ thể
- **Sắp Xếp**:
  - Sắp xếp theo ngày đặt hàng (mới nhất trước)
  - Sắp xếp theo tổng tiền (cao nhất trước)
- **Đặt Lại**: Nút nhanh để xóa tất cả bộ lọc

### 3. **Thêm Đơn Hàng Mới**

Khi nhấn "Thêm Đơn Hàng", Modal sẽ hiện ra với các trường:

#### Thông Tin Khách Hàng:

- **Mã Đơn Hàng**: Nhập mã (không để trống, không trùng lặp)
- **Tên Khách Hàng**: Tên đầy đủ của khách hàng
- **Số Điện Thoại**: Số liên lạc
- **Địa Chỉ**: Địa chỉ giao hàng

#### Chọn Sản Phẩm:

1. Chọn sản phẩm từ danh sách (hiển thị tên + giá)
2. Nhập số lượng
3. Nhấn nút "Thêm" để thêm vào đơn hàng
4. Có thể thêm nhiều sản phẩm, tổng tiền tự động tính toán

#### Danh Sách Sản Phẩm Đã Chọn:

- Hiển thị bảng chi tiết sản phẩm
- Cột "Thành Tiền" tính tự động (Giá × Số Lượng)
- Có nút "Xóa" để loại bỏ sản phẩm khỏi đơn hàng
- Hiển thị tổng tiền của toàn đơn

#### Chọn Trạng Thái:

- Mặc định là "Chờ xác nhận"
- Có thể đổi ngay khi tạo đơn hàng

### 4. **Chỉnh Sửa Đơn Hàng**

- Nhấn nút "Sửa" trên bất kỳ đơn hàng nào
- Cập nhật lại thông tin khách hàng, sản phẩm, trạng thái
- Hệ thống sẽ cảnh báo nếu có dữ liệu chưa lưu

### 5. **Hủy Đơn Hàng (Có Điều Kiện)**

- ✅ **Chỉ có thể hủy** đơn ở trạng thái "Chờ xác nhận"
- ❌ Không thể hủy đơn đang giao, hoàn thành, hoặc đã hủy
- Hiển thị **cảnh báo** trước khi thực hiện hủy
- Một khi hủy, trạng thái sẽ chuyển thành "Hủy"

### 6. **Xóa Đơn Hàng**

- Nhấn nút "Xóa" để xóa hoàn toàn khỏi hệ thống
- Hiển thị xác nhận trước khi xóa
- Hành động này không thể hoàn tác

### 7. **Thống Kê & Dashboard**

Hiển thị trên đầu trang:

- 📊 **Tổng Đơn Hàng**: Số lượng tất cả đơn hàng
- 🟠 **Chờ Xác Nhận**: Số đơn chờ xác nhận
- 🔵 **Đang Giao**: Số đơn đang giao
- 💰 **Doanh Thu**: Tổng doanh thu từ các đơn hoàn thành

---

## 🔍 Xác Thực Dữ Liệu

Hệ thống kiểm tra:

- ✅ **Không để trống**: Tất cả các trường bắt buộc phải có dữ liệu
- ✅ **Không trùng mã**: Mã đơn hàng phải là duy nhất
- ✅ **Sản phẩm hợp lệ**: Phải chọn ít nhất một sản phẩm
- ✅ **Số lượng hợp lệ**: Số lượng phải là số dương

---

## 📁 Cấu Trúc Tệp

### Models

```
src/models/donhang/index.ts
├── Interfaces: DonHang, DonHangProduct, UseDonHangModel
├── Status Types: 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy'
└── Mock Data: 3 đơn hàng mẫu
```

### Pages

```
src/pages/DonHang/
├── index.tsx (Thành phần chính 400+ dòng)
└── index.less (Styling)
```

### Routes

```
config/routes.ts
└── /don-hang → Quản Lý Đơn Hàng (ShoppingOutlined)
```

---

## 💾 Lưu Trữ Dữ Liệu

- **Local Storage**: Tất cả dữ liệu được lưu vào `localStorage` với key `donhang_data`
- **Tự động lưu**: Mỗi khi có thay đổi, dữ liệu sẽ tự động lưu
- **Load khi mở**: Khi trang tải, dữ liệu sẽ được tự động tải từ localStorage

---

## 🎨 Giao Diện

### Bố Cục

- **Header**: Tiêu đề + Nút làm mới
- **Thống Kê**: 4 card hiển thị KPI chính
- **Công Cụ Tìm Kiếm**: Input search, filter, sort, reset
- **Bảng Dữ Liệu**: Responsive, scroll ngang cho màn hình nhỏ
- **Modal**: Cho thêm/sửa đơn hàng

### Màu Sắc

- 🟠 Chờ xác nhận: `orange`
- 🔵 Đang giao: `blue`
- 🟢 Hoàn thành: `green`
- 🔴 Hủy: `red`

---

## 🚀 Tính Năng Nâng Cao

### Tự Động Tính Toán

- Tổng tiền mỗi sản phẩm = Giá × Số Lượng
- Tổng đơn hàng = Σ(Giá × Số Lượng) của tất cả sản phẩm
- Doanh thu = Tổng tiền của các đơn ở trạng thái "Hoàn thành"

### Validation Thông Minh

- Kiểm tra trùng mã đơn hàng khi tạo mới
- Yêu cầu ít nhất một sản phẩm trong đơn hàng
- Cảnh báo trước khi hủy/xóa dơn hàng

---

## 📱 Responsive Design

- Hiệu ứng tốt trên mobile, tablet, desktop
- Bảng cuộn ngang trên màn hình nhỏ
- Toolbar linh hoạt trên mobile

---

## 🔗 Liên Kết Đến Các Module Khác

- **SanPham Model**: Dùng để lấy danh sách sản phẩm
- **Sử dụng cùng pattern** với các module khác như DichVu, CauLacBo, etc.

---

## 💡 Các Kịch Bản Sử Dụng

### 1. Tạo Đơn Hàng Mới

```
1. Nhấn "Thêm Đơn Hàng"
2. Nhập mã, tên khách, SĐT, địa chỉ
3. Chọn sản phẩm + số lượng, nhấn "Thêm"
4. Lặp lại bước 3 cho các sản phẩm khác
5. Chọn trạng thái
6. Nhấn "Lưu"
```

### 2. Tìm Kiếm Đơn Hàng

```
1. Nhập mã đơn hoặc tên khách vào ô tìm kiếm
2. Danh sách sẽ tự động lọc
3. Nhấn nút "X" để xóa tìm kiếm
```

### 3. Hủy Đơn Hàng

```
1. Chỉ đơn ở trạng thái "Chờ xác nhận" mới hủy được
2. Nhấn nút "Hủy" (màu đỏ)
3. Xác nhận trong modal
4. Trạng thái chuyển thành "Hủy"
```

---

## 📊 API Functions (useDonHangModel)

```typescript
// Thêm đơn hàng
addDonHang(donHang: Omit<DonHang, 'id' | 'createdAt'>) => void

// Cập nhật toàn bộ thông tin
updateDonHang(id: string, updates: Partial<Omit<DonHang, ...>>) => DonHang | undefined

// Cập nhật chỉ trạng thái
updateDonHangStatus(id: string, status: DonHangStatus) => DonHang | undefined

// Lấy đơn hàng theo ID
getDonHangById(id: string) => DonHang | undefined

// Xóa đơn hàng
deleteDonHang(id: string) => boolean

// Lọc theo trạng thái
getDonHangsByStatus(status: DonHangStatus) => DonHang[]

// Tính doanh thu
getCompletedOrdersRevenue() => number

// Tìm kiếm
searchDonHang(keyword: string) => DonHang[]

// Kiểm tra mã tồn tại
isDonHangIdExists(id: string) => boolean

// Kiểm tra có thể hủy
canCancelOrder(status: DonHangStatus) => boolean
```

---

## ✅ Danh Sách Kiểm Tra

- ✓ Hiển thị danh sách đơn hàng với tất cả thông tin
- ✓ Tìm kiếm theo mã đơn hoặc tên khách
- ✓ Lọc theo trạng thái
- ✓ Sắp xếp theo ngày hoặc tổng tiền
- ✓ Thêm đơn hàng mới
- ✓ Chỉnh sửa đơn hàng
- ✓ Xóa đơn hàng
- ✓ Hủy đơn hàng (chỉ khi ở trạng thái "Chờ xác nhận")
- ✓ Cảnh báo trước khi hủy
- ✓ Kiểm tra dữ liệu (không trống, không trùng mã)
- ✓ Giao diện đẹp, responsive
- ✓ Tất cả chức năng hoạt động đúng
- ✓ Match với codebase pattern

---

## 📞 Hỗ Trợ

Nếu có thắc mắc, vui lòng kiểm tra:

1. Tất cả các trường trong form đã được điền đầy đủ?
2. Mã đơn hàng có bị trùng không?
3. Có ít nhất một sản phẩm trong đơn hàng không?
4. Trình duyệt có hỗ trợ localStorage không?
