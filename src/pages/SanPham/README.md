# Quản lý Sản phẩm - Hướng dẫn

## Giới thiệu
Ứng dụng Quản lý Sản phẩm xây dựng bằng ReactJS, UmiJS và Ant Design cung cấp các chức năng cơ bản để quản lý danh sách sản phẩm.

## Cấu trúc dự án

```
src/
├── models/
│   └── sanpham/
│       └── index.ts              # Model quản lý state sản phẩm
├── pages/
│   └── SanPham/
│       ├── index.tsx             # Trang chính quản lý sản phẩm
│       ├── AddSanPhamModal.tsx    # Component Modal thêm sản phẩm
│       └── index.less            # Styles
└── locales/
    └── vi-VN/
        └── menu.ts               # i18n tiếng Việt
```

## Các chức năng

### 1. Hiển thị danh sách sản phẩm
- Sử dụng Ant Design Table hiển thị dữ liệu
- Các cột: STT, Tên sản phẩm, Giá, Số lượng, Thao tác
- Dữ liệu khởi tạo sẵn với 5 sản phẩm mẫu
- Hỗ trợ phân trang (mặc định 10 dòng/trang)

### 2. Thêm sản phẩm mới
- Nhấn nút "Thêm sản phẩm" để mở Modal
- Form chứa các trường:
  - **Tên sản phẩm**: Bắt buộc, không được để trắng
  - **Giá**: Bắt buộc, phải là số dương
  - **Số lượng**: Bắt buộc, phải là số nguyên dương
- Validation tự động trước khi lưu
- Hiển thị message thông báo khi thêm thành công

### 3. Xóa sản phẩm
- Nhấn nút "Xóa" ở cột Thao tác
- Hiển thị Popconfirm để xác nhận trước khi xóa
- Hiển thị message thông báo khi xóa thành công

### 4. Tìm kiếm sản phẩm
- Sử dụng ô Input.Search phía trên bảng
- Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)
- Kết quả cập nhật realtime khi người dùng nhập
- Hỗ trợ nút Clear để xóa tìm kiếm

## Dữ liệu mẫu
Ứng dụng khởi tạo sẵn 5 sản phẩm:
```
1. Laptop Dell XPS 13 - 25,000,000 đ - 10 cái
2. iPhone 15 Pro Max - 30,000,000 đ - 15 cái
3. Samsung Galaxy S24 - 22,000,000 đ - 20 cái
4. iPad Air M2 - 18,000,000 đ - 12 cái
5. MacBook Air M3 - 28,000,000 đ - 8 cái
```

## Công nghệ sử dụng
- **Frontend**: ReactJS, UmiJS
- **UI Library**: Ant Design 4.21.0
- **Language**: TypeScript
- **State Management**: React Hooks (useState)
- **Styling**: Less

## Cách chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Truy cập trang quản lý sản phẩm
http://localhost:8000/san-pham
```

## Tính năng React Hooks sử dụng
- `useState`: Quản lý state danh sách sản phẩm, modal visibility, search text, loading state
- `useMemo`: Tối ưu hóa filter tìm kiếm, chỉ re-compute khi cần thiết

## Quy trình làm việc

1. **Khởi động**: Trang tải danh sách sản phẩm mặc định từ mock data
2. **Thêm sản phẩm**: Nhấn "Thêm sản phẩm" → Điền form → Validate → Lưu → Cập nhật bảng
3. **Tìm kiếm**: Nhập vào ô search → Filter realtime → Hiển thị kết quả
4. **Xóa sản phẩm**: Nhấn nút Xóa → Confirm → Xóa → Cập nhật bảng

## Ghi chú
- Dữ liệu được lưu trữ trong state React, sẽ reset khi tải lại trang
- Để lưu trữ lâu dài, cần tích hợp API backend
- Tất cả thông báo đều được hiển thị bằng `message` component của Ant Design
