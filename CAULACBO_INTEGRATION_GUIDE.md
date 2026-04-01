# Hệ thống Quản lý Câu lạc bộ - Hướng dẫn Tích hợp

## ✅ Danh sách Triển khai Hoàn thành

### Models & Types (✅ Hoàn thành)
- [x] `src/models/caulacbo/caulacbo.ts` - Định nghĩa types cho Câu lạc bộ, Đơn đăng ký, Lịch sử
- [x] `src/models/caulacbo/index.ts` - Export models
- [x] Cập nhật `src/models/index.ts` để export caulacbo models

### Services (✅ Hoàn thành)
- [x] `src/services/CauLacBo/index.ts` - API endpoints cho:
  - Câu lạc bộ (CRUD)
  - Đơn đăng ký (CRUD, approve/reject single & multiple)
  - Lịch sử thao tác
  - Thành viên (view, change club)
  - Thống kê (tổng quan, theo CLB)

### Pages & Components (✅ Hoàn thành)

#### Main Page
- [x] `src/pages/CauLacBo/index.tsx` - Main component với Tabs
- [x] `src/pages/CauLacBo/index.less` - Styling

#### Tab 1: Danh sách Câu lạc bộ
- [x] `src/pages/CauLacBo/DanhSachCauLacBo.tsx`
  - Bảng hiển thị CLB (ảnh, tên, ngày, mô tả, chủ nhiệm, hoạt động)
  - Tìm kiếm trực tiếp trên table
  - Thao tác: Thêm, Sửa, Xóa, Xem thành viên
- [x] `src/pages/CauLacBo/components/ModalCauLacBo.tsx`
  - Form thêm/sửa câu lạc bộ
  - Upload ảnh
  - HTML editor cho mô tả
- [x] `src/pages/CauLacBo/components/ModalViewMembers.tsx`
  - Modal xem danh sách thành viên của CLB

#### Tab 2: Quản lý Đơn đăng ký
- [x] `src/pages/CauLacBo/QuanLyDonDangKy.tsx`
  - Bảng đơn đăng ký (tên, email, SĐT, giới tính, địa chỉ, sở trường, CLB, lý do, trạng thái)
  - Tìm kiếm và lọc theo trạng thái
  - Thao tác: Xem chi tiết, Sửa, Xóa, Duyệt, Từ chối
  - **Hỗ trợ multiple selection**:
    - Duyệt nhiều đơn cùng lúc
    - Từ chối nhiều đơn (bắt buộc nhập lý do)
  - Xem lịch sử thao tác
- [x] `src/pages/CauLacBo/components/ModalDonDangKy.tsx`
  - Form thêm/sửa đơn đăng ký
- [x] `src/pages/CauLacBo/components/ModalLichSu.tsx`
  - Modal xem lịch sử thao tác (duyệt/từ chối, người thao tác, thời điểm, lý do)

#### Tab 3: Quản lý Thành viên
- [x] `src/pages/CauLacBo/QuanLyThanhVien.tsx`
  - Danh sách thành viên (chỉ approved)
  - Tìm kiếm và lọc theo CLB
  - Hỗ trợ multiple selection để chuyển thành viên sang CLB khác
  - Modal xác nhận khi chuyển

#### Tab 4: Báo cáo & Thống kê
- [x] `src/pages/CauLacBo/ThongKe.tsx`
  - Thẻ thống kê tổng quan (Số CLB, Tổng đơn, Pending, Approved, Rejected)
  - Biểu đồ cột (ApexCharts) theo câu lạc bộ
  - Bảng chi tiết thống kê

## 📝 Hướng dẫn Tích hợp

### Step 1: Kiểm tra các file đã tạo
```bash
# Models
src/models/caulacbo/
├── caulacbo.ts
├── index.ts

# Services
src/services/CauLacBo/
├── index.ts
├── mockData.ts (optional, for development)

# Pages & Components
src/pages/CauLacBo/
├── index.tsx
├── index.less
├── DanhSachCauLacBo.tsx
├── QuanLyDonDangKy.tsx
├── QuanLyThanhVien.tsx
├── ThongKe.tsx
├── components/
│   ├── ModalCauLacBo.tsx
│   ├── ModalViewMembers.tsx
│   ├── ModalDonDangKy.tsx
│   └── ModalLichSu.tsx
```

### Step 2: Thêm route vào `config/routes.ts`
```typescript
{
  path: '/caulacbo',
  name: 'Câu lạc bộ',
  icon: 'TeamOutlined',
  component: './CauLacBo',
}
```

### Step 3: Thực hiện Backend APIs
Tạo các endpoint tương ứng với service definitions trong `src/services/CauLacBo/index.ts`

**Ví dụ API cơ bản:**
- `GET /api/caulacbo/list`
- `POST /api/caulacbo`
- `PUT /api/caulacbo/{id}`
- `DELETE /api/caulacbo/{id}`
- `PATCH /api/caulacbo/dongangky/{id}/approve`
- `PATCH /api/caulacbo/dongangky/{id}/reject`
- v.v. (xem danh sách đầy đủ trong `CAULACBO_IMPLEMENTATION.md`)

### Step 4: Testing
```bash
# 1. Kiểm tra types
npm run tsc

# 2. Lint code
npm run lint:js

# 3. Build project
npm run build

# 4. Chạy dev server
npm run start:dev
```

## 🔧 Configuration & Customization

### Thay đổi Styling
- File main: `src/pages/CauLacBo/index.less`
- Sử dụng các utility classes từ Ant Design
- Customize theo design system của project

### Thêm Validation
- Trong form components, thêm rules vào `Form.Item`
- Ví dụ: `rules={[{ required: true, message: 'Bắt buộc' }]}`

### Upload File
- Sử dụng `buildUpLoadFile` từ `@/services/uploadFile`
- Scope: `PUBLIC`, `INTERNAL`, `PRIVATE`
- Hỗ trợ các định dạng ảnh thông dụng

### HTML Editor
- Sử dụng component `TinyEditor` từ `@/components/TinyEditor`
- Có thể customize plugins, toolbar, v.v.

## 🧪 Mock Data (for Development)

Nếu backend không sẵn sàng, có thể là sử dụng localStorage:

```typescript
import { localStorageService } from '@/services/CauLacBo/mockData';

const getCauLacBoList = async () => {
  return { data: localStorageService.getCauLacBoList() };
};
```

## 📋 Verification Checklist

- [ ] Tất cả files đã được tạo
- [ ] Models được export trong `src/models/index.ts`
- [ ] Route được thêm vào `config/routes.ts`
- [ ] Không có lỗi TypeScript (`npm run tsc`)
- [ ] Không có lỗi ESLint (`npm run lint:js`)
- [ ] Backend APIs đã được implement
- [ ] Upload file service đang hoạt động
- [ ] TinyEditor component có sẵn
- [ ] Recharts hoặc ApexCharts đã installed
- [ ] UI hiển thị đúng trên desktop & mobile
- [ ] Các tính năng chính đã test:
  - [ ] Thêm/Sửa/Xóa CLB
  - [ ] Duyệt đơn (single & multiple)
  - [ ] Từ chối đơn (single & multiple)
  - [ ] Chuyển thành viên sang CLB khác
  - [ ] Xem lịch sử thao tác
  - [ ] Xem báo cáo & thống kê

## 🐛 Troubleshooting

### TypeError: Cannot read property '...'
- Kiểm tra response data structure từ API
- Kiểm tra default value trong destructuring

### Modal không hiển thị
- Kiểm tra prop `visible` từ parent component
- Kiểm tra z-index CSS

### Upload ảnh thất bại
- Kiểm tra endpoint upload file
- Kiểm tra CORS headers
- Kiểm tra file size limit

### Biểu đồ không render
- Kiểm tra data format trong ApexCharts
- Kiểm tra chart configuration
- Inspect browser console cho lỗi

## 📞 Contact

Để hỗ trợ hoặc báo lỗi, vui lòng liên hệ team development.

---

**Ngày tạo:** 01/04/2026  
**Phiên bản:** 1.0  
**Status:** ✅ Hoàn thành (Ready for Integration)
