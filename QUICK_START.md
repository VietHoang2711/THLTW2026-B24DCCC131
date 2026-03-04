# 🚀 Hướng dẫn nhanh - Bắt đầu

## 📍 Truy cập ứng dụng

Nhấp vào một trong các routes sau:
- `/quan-ly` 
- `/quanly`

## 🎯 Giao diện chính

Ứng dụng có **3 tab chính**:

### 1. 📊 Bảng điều khiển (Dashboard)
Hiển thị tổng quan:
- Tổng sản phẩm, giá trị kho, đơn hàng, doanh thu
- Biểu đồ trạng thái sản phẩm
- Biểu đồ trạng thái đơn hàng
- Cảnh báo sản phẩm sắp hết
- Đơn hàng gần đây

### 2. 🛍️ Quản lý Sản phẩm
**Thao tác cơ bản:**

#### Thêm sản phẩm
1. Nhấp "Thêm sản phẩm"
2. Điền:
   - Tên sản phẩm
   - Danh mục (Laptop / Điện thoại / Máy tính bảng / Phụ kiện)
   - Giá
   - Số lượng
3. Nhấp "Thêm mới"

#### Sửa sản phẩm
1. Tìm sản phẩm trong bảng
2. Nhấp "Sửa"
3. Sửa thông tin
4. Nhấp "Cập nhật"

#### Xóa sản phẩm
1. Tìm sản phẩm
2. Nhấp "Xóa"
3. Xác nhận

**Tìm kiếm & Lọc:**
- **Tìm kiếm**: Gõ tên sản phẩm
- **Danh mục**: Chọn từ dropdown
- **Giá**: Kéo thanh slider
- **Trạng thái**: Chọn từ dropdown

**Sắp xếp:**
- Tên (A-Z)
- Giá (thấp-cao, cao-thấp)
- Số lượng

### 3. 📦 Quản lý Đơn hàng
**Tạo đơn hàng:**
1. Nhấp "Tạo đơn hàng"
2. Điền thông tin khách hàng:
   - Tên
   - Số điện thoại (định dạng: 0xxxxxxxxx)
   - Địa chỉ
3. Chọn sản phẩm (có thể chọn nhiều)
4. Nhập số lượng cho mỗi sản phẩm
5. Xem tổng tiền (tự động tính)
6. Nhấp "Tạo"

**Cập nhật trạng thái:**
1. Tìm đơn hàng trong bảng
2. Chọn trạng thái mới từ dropdown:
   - Chờ xử lý
   - Đang giao
   - Hoàn thành (⚠️ Sẽ trừ kho)
   - Đã hủy (⚠️ Sẽ hoàn kho)

**Xem chi tiết:**
1. Nhấp "Chi tiết"
2. Drawer mở hiển thị:
   - Thông tin khách
   - Danh sách sản phẩm
   - Tổng tiền

**Tìm kiếm & Lọc:**
- **Tìm kiếm**: Tên khách hoặc mã đơn
- **Trạng thái**: Chọn từ dropdown
- **Khoảng ngày**: Chọn từ date picker

## 🔍 Trạng thái sản phẩm

| Trạng thái | Màu | Điều kiện |
|-----------|-----|----------|
| 🟢 Còn hàng | Green | Số lượng > 10 |
| 🟠 Sắp hết | Orange | Số lượng 1-10 |
| 🔴 Hết hàng | Red | Số lượng = 0 |

## 📋 Trạng thái đơn hàng

| Trạng thái | Màu | Mô tả |
|-----------|-----|--------|
| ⏳ Chờ xử lý | Gold | Vừa tạo |
| 🚚 Đang giao | Blue | Đang vận chuyển |
| ✅ Hoàn thành | Green | Giao thành công |
| ❌ Đã hủy | Red | Đã hủy đơn |

## ⚠️ Lưu ý quan trọng

1. **Quản lý kho tự động**:
   - Khi đơn chuyển sang "Hoàn thành" → **Số lượng sản phẩm sẽ giảm**
   - Khi đơn chuyển sang "Đã hủy" → **Số lượng sản phẩm sẽ tăng lại**

2. **Validation**:
   - Số lượng đặt **không được vượt quá kho**
   - Số điện thoại phải là **10-11 chữ số bắt đầu 0**
   - **Tất cả fields bắt buộc**

3. **Lưu trữ**:
   - Dữ liệu tự động lưu vào browser
   - **Refresh trang vẫn có dữ liệu**
   - Clear cache/cookies sẽ xóa dữ liệu

## 🎨 Dữ liệu mẫu

**Sản phẩm mẫu** (8 sản phẩm):
- Laptop Dell XPS 13 (25M)
- iPhone 15 Pro Max (30M)
- Samsung Galaxy S24 (22M)
- iPad Air M2 (18M)
- MacBook Air M3 (28M)
- AirPods Pro 2 (6M - hết hàng)
- Samsung Galaxy Tab S9 (15M)
- Logitech MX Master 3 (2.5M)

**Đơn hàng mẫu** (1 đơn):
- DH001: Nguyễn Văn A (1 Laptop Dell XPS)

## 💡 Tips

- **Tìm kiếm nhanh**: Sử dụng tính năng tìm kiếm thay vì scroll
- **Lọc hiệu quả**: Kết hợp nhiều bộ lọc để tìm nhanh hơn
- **Export dữ liệu**: Dữ liệu có thể xem trong DevTools → Application → Local Storage
- **Sắp xếp**: Chọn "Không sắp xếp" để quay lại thứ tự mặc định

## ❓ Câu hỏi thường gặp

**Q: Dữ liệu được lưu ở đâu?**
A: Trong localStorage của browser (local.domain.com). Mở DevTools → Application → Local Storage → Chọn domain → Tìm `sanpham_data` hoặc `donhang_data`

**Q: Làm sao để xóa hết dữ liệu?**
A: DevTools → Application → Local Storage → Right-click → Delete → Reload page

**Q: Tại sao số lượng sản phẩm giảm?**
A: Vì bạn đã cập nhật đơn hàng thành "Hoàn thành". Hệ thống tự động trừ kho.

**Q: Có thể khôi phục đơn hàng không?**
A: Có, chuyển đơn từ "Đã hủy" sang trạng thái khác để hoàn kho.

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Refresh page
2. Clear browser cache
3. Check console (F12 → Console) để xem lỗi
4. Kiểm tra data trong Local Storage

---

**Tức thì bắt đầu**: Truy cập `/quan-ly` và khám phá! 🎉
