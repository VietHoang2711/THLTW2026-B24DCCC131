# Hệ thống Quản lý Sản phẩm và Đơn hàng

## Giới thiệu

Đây là một ứng dụng web quản lý sản phẩm và đơn hàng được xây dựng với **ReactJS**, **UmiJS** và **Ant Design**. Ứng dụng cung cấp các tính năng toàn diện cho việc quản lý kho sản phẩm và xử lý đơn hàng.

## 🎯 Chức năng chính

### 1. Bảng điều khiển (Dashboard)

- **Thống kê tổng quan**: Hiển thị tổng sản phẩm, giá trị tồn kho, tổng đơn hàng, và doanh thu
- **Trạng thái sản phẩm**: Biểu đồ phân bố sản phẩm theo trạng thái (Còn hàng, Sắp hết, Hết hàng)
- **Trạng thái đơn hàng**: Thống kê đơn hàng theo từng trạng thái
- **Cảnh báo**: Danh sách sản phẩm sắp hết
- **Đơn hàng gần đây**: Hiển thị 5 đơn hàng mới nhất
- **Phân bố theo danh mục**: Thống kê số lượng và giá trị theo danh mục

### 2. Quản lý Sản phẩm

#### Các cột bảng:
- **STT**: Số thứ tự
- **Tên sản phẩm**: Tên sản phẩm
- **Danh mục**: Danh mục sản phẩm (Laptop, Điện thoại, Máy tính bảng, Phụ kiện)
- **Giá**: Giá bán sản phẩm
- **Số lượng**: Số lượng tồn kho
- **Trạng thái**: Hiển thị dưới dạng Tag với màu sắc:
  - 🟢 **Còn hàng**: Số lượng > 10
  - 🟠 **Sắp hết**: Số lượng 1-10
  - 🔴 **Hết hàng**: Số lượng = 0
- **Thao tác**: Các nút Sửa và Xóa

#### Tính năng:
- ✅ **Thêm sản phẩm**: Form modal để thêm sản phẩm mới
- ✅ **Sửa sản phẩm**: Chỉnh sửa thông tin sản phẩm đã có
- ✅ **Xóa sản phẩm**: Xóa sản phẩm với xác nhận
- ✅ **Tìm kiếm**: Tìm kiếm theo tên sản phẩm
- ✅ **Lọc**: 
  - Lọc theo danh mục
  - Lọc theo khoảng giá (Slider)
  - Lọc theo trạng thái
- ✅ **Sắp xếp**:
  - Tên (A-Z)
  - Giá (thấp-cao, cao-thấp)
  - Số lượng
- ✅ **Phân trang**: Hiển thị 5 sản phẩm mỗi trang (có thể thay đổi)
- ✅ **Thống kê**: Hiển thị tổng sản phẩm, giá trị tồn kho, sản phẩm còn hàng, hết hàng

### 3. Quản lý Đơn hàng

#### Các cột bảng:
- **Mã đơn hàng**: Mã định danh đơn hàng (DH001, DH002, ...)
- **Tên khách hàng**: Tên người đặt hàng
- **Số sản phẩm**: Số lượng sản phẩm trong đơn
- **Tổng tiền**: Tổng giá trị đơn hàng
- **Trạng thái**: Trạng thái đơn hàng (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
- **Ngày tạo**: Ngày tạo đơn hàng
- **Thao tác**: Nút xem chi tiết và xóa

#### Tính năng tạo đơn hàng:
- ✅ **Nhập thông tin khách hàng**:
  - Tên khách hàng (bắt buộc)
  - Số điện thoại (bắt buộc, định dạng 10-11 số bắt đầu bằng 0)
  - Địa chỉ (bắt buộc)
- ✅ **Chọn sản phẩm**: Sử dụng Multi-Select
- ✅ **Nhập số lượng**: Cho mỗi sản phẩm
  - Validation: Không được vượt quá số lượng tồn kho
- ✅ **Tính tổng tiền**: Tự động cập nhật khi thay đổi số lượng
- ✅ **Xem chi tiết**: Modal hiển thị:
  - Thông tin khách hàng
  - Danh sách sản phẩm với số lượng và giá
  - Tổng tiền đơn hàng

#### Quản lý trạng thái:
- ✅ **Cập nhật trạng thái**: Dropdown để thay đổi trạng thái đơn hàng
  - Chờ xử lý → Đang giao → Hoàn thành → Đã hủy
- ✅ **Quản lý kho tự động**:
  - Khi đơn hàng chuyển sang "Hoàn thành": ➖ Trừ số lượng tồn kho
  - Khi đơn hàng chuyển sang "Đã hủy": ➕ Hoàn trả số lượng về kho
  - Khi thay đổi từ "Hoàn thành" sang trạng thái khác: ➕ Hoàn trả số lượng

#### Tìm kiếm và lọc:
- ✅ **Tìm kiếm**: Theo tên khách hàng hoặc mã đơn hàng
- ✅ **Lọc theo trạng thái**: Chọn một hoặc nhiều trạng thái
- ✅ **Lọc theo khoảng ngày**: Sử dụng DatePicker.RangePicker
- ✅ **Sắp xếp**:
  - Ngày tạo (mới-cũ, cũ-mới)
  - Tổng tiền (thấp-cao, cao-thấp)

## 📊 Dữ liệu mẫu

### Sản phẩm khởi tạo

```javascript
[
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
]
```

### Đơn hàng mẫu

```javascript
[
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
]
```

## 🛠️ Công nghệ sử dụng

- **ReactJS**: Thư viện UI chính
- **UmiJS**: Framework React với nhiều tính năng tích hợp
- **Ant Design**: UI Component Library
- **TypeScript**: Hỗ trợ type-safe
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **localStorage**: Lưu trữ dữ liệu (tồn tại giữa các phiên)
- **Day.js**: Xử lý ngày tháng

## 📁 Cấu trúc thư mục

```
src/
├── models/
│   ├── sanpham/
│   │   └── index.ts          # Model và hooks quản lý sản phẩm
│   └── donhang/
│       └── index.ts          # Model và hooks quản lý đơn hàng
├── pages/
│   ├── Dashboard/
│   │   ├── index.tsx         # Trang bảng điều khiển
│   │   └── index.less        # Styles
│   ├── SanPham/
│   │   ├── index.tsx         # Trang quản lý sản phẩm
│   │   ├── AddSanPhamModal.tsx   # Modal thêm sản phẩm
│   │   ├── EditSanPhamModal.tsx  # Modal sửa sản phẩm
│   │   └── index.less        # Styles
│   ├── DonHang/
│   │   ├── index.tsx         # Trang quản lý đơn hàng
│   │   ├── CreateDonHangModal.tsx # Modal tạo đơn hàng
│   │   └── index.less        # Styles
│   └── QuanLy/
│       ├── index.tsx         # Trang chính tích hợp
│       └── index.less        # Styles
```

## 🔑 Quy trình làm việc

### Thêm sản phẩm
1. Nhấp nút "Thêm sản phẩm"
2. Điền thông tin (Tên, Danh mục, Giá, Số lượng)
3. Nhấp "Thêm mới"

### Sửa sản phẩm
1. Tìm sản phẩm trong bảng
2. Nhấp nút "Sửa"
3. Chỉnh sửa thông tin
4. Nhấp "Cập nhật"

### Tạo đơn hàng
1. Nhấp nút "Tạo đơn hàng"
2. Nhập thông tin khách hàng (Tên, Số điện thoại, Địa chỉ)
3. Chọn sản phẩm từ dropdown
4. Nhập số lượng cho mỗi sản phẩm
5. Xem tổng tiền (tự động tính)
6. Nhấp "Tạo"

### Cập nhật trạng thái đơn hàng
1. Tìm đơn hàng trong bảng
2. Chọn trạng thái mới từ dropdown
3. Hệ thống tự động:
   - Cập nhật số lượng tồn kho nếu cần
   - Lưu thay đổi vào localStorage

### Xem chi tiết đơn hàng
1. Nhấp nút "Chi tiết" của đơn hàng
2. Drawer sẽ mở hiển thị:
   - Thông tin khách hàng
   - Danh sách sản phẩm với chi tiết
   - Tổng tiền

## 💾 Lưu trữ dữ liệu

- Dữ liệu được lưu tự động vào **localStorage** với các keys:
  - `sanpham_data`: Dữ liệu sản phẩm
  - `donhang_data`: Dữ liệu đơn hàng
- Dữ liệu sẽ tồn tại giữa các phiên làm việc
- Khi truy cập lần đầu, nếu không có dữ liệu, hệ thống sẽ sử dụng dữ liệu mẫu

## ✨ Tính năng nâng cao

- ✅ **Validation toàn diện**: Kiểm tra đầu vào ở cả client-side
- ✅ **Quản lý state**: Sử dụng React Hooks (useState, useEffect, useMemo, useCallback)
- ✅ **Responsive design**: Tương thích với desktop và mobile
- ✅ **Performance optimization**: Sử dụng useMemo, useCallback để tránh re-render không cần thiết
- ✅ **User-friendly messages**: Hiển thị thông báo thành công/lỗi
- ✅ **Confirmation dialogs**: Xác nhận trước khi xóa

## 🚀 Hướng phát triển tương lai

- Thêm API backend để lưu trữ dữ liệu trên server
- Thêm authentication/authorization
- Thêm báo cáo in được
- Thêm export dữ liệu (Excel, PDF)
- Thêm tính năng thanh toán
- Thêm quản lý users/roles
- Thêm notification system
- Thêm analytics/charts chi tiết

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2024
