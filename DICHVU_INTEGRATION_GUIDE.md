# Hướng Dẫn Tích Hợp DichVu Module vào App

## 1. Cập Nhật Routing

### Bước 1: Kiểm tra file `config/routes.ts`

Thêm route cho DichVu:

```typescript
{
  path: '/dichvu',
  name: 'Dịch Vụ',
  icon: 'shopping',
  component: './DichVu',  // Component ở src/pages/DichVu/index.tsx
}
```

### Bước 2: Cập Nhật Layout Menu

Nếu sử dụng layout chung, thêm menu item vào navigation:

```typescript
{
  name: 'Dịch Vụ',
  path: '/dichvu',
  icon: 'shopping',
}
```

## 2. Import Models & Services

### Sử dụng trong Component Khác

```typescript
import { useNhanVienModel, useDichVuModel, useLichHenModel, useDanhGiaModel } from '@/models/dichvu';

export default function MyComponent() {
  const { nhanViens } = useNhanVienModel();
  const { dichVus } = useDichVuModel();
  const { lichHens } = useLichHenModel();
  const { danhGias } = useDanhGiaModel();
  
  // Sử dụng...
}
```

## 3. API Integration (Tương Lai)

Hiện tại ứng dụng sử dụng **localStorage**. Để tích hợp backend API:

### Bước 1: Cập Nhật Services

File: `src/services/DichVu/index.ts` đã có các endpoint cơ bản:

```typescript
export async function getNhanVienList() {
  return request('/api/dichvu/nhanvien', { method: 'GET' });
}

export async function addNhanVien(data: any) {
  return request('/api/dichvu/nhanvien', { method: 'POST', data });
}

// ... các hàm khác
```

### Bước 2: Cập Nhật Models để sử dụng API

Ví dụ cho `useNhanVienModel`:

```typescript
export const useNhanVienModel = (): UseNhanVienModel => {
  const [nhanViens, setNhanViens] = useState<NhanVien[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNhanViens();
  }, []);

  const fetchNhanViens = async () => {
    setLoading(true);
    try {
      const data = await getNhanVienList(); // Gọi API
      setNhanViens(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return {
    nhanViens,
    addNhanVien: async (nhanVien) => {
      const response = await addNhanVien(nhanVien);
      setNhanViens([...nhanViens, response]);
    },
    // ... các hàm khác
  };
};
```

## 4. Styling & Customization

### Cập Nhật Theme

File: `src/pages/DichVu/index.less`

```less
.sidebar {
  // Tùy chỉnh màu sắc
  background: #001529;  // Thay đổi màu nền
  
  .logo {
    color: white;
    border-bottom: 1px solid #434343;
  }
}

.content {
  padding: 24px;
  background: #f5f5f5;
}
```

## 5. Thêm Mock Data

Mock data được định nghĩa trong mỗi model file:

```typescript
const MOCK_NHAN_VIEN: NhanVien[] = [
  { id: 'nv001', hoTen: 'Nguyễn Thị Hoa', ... },
  // ...
];
```

Để thêm dữ liệu mặc định khác, chỉnh sửa các array này.

## 6. Chiếu Dữ Liệu Sang Component Khác

### Ví dụ: Hiển thị Danh Sách Nhân Viên trong Dashboard

```typescript
import { useNhanVienModel } from '@/models/dichvu';

export default function Dashboard() {
  const { nhanViens } = useNhanVienModel();
  
  return (
    <div>
      <h2>Danh Sách Nhân Viên</h2>
      {nhanViens.map(nv => (
        <div key={nv.id}>
          {nv.hoTen} - {nv.email}
        </div>
      ))}
    </div>
  );
}
```

## 7. Xử Lý Lỗi & Logging

Thêm error handling:

```typescript
try {
  addNhanVien(formData);
  message.success('Thêm nhân viên thành công');
} catch (error) {
  console.error('Error:', error);
  message.error('Có lỗi xảy ra: ' + error.message);
}
```

## 8. Testing

### Unit Test cho Models

```typescript
import { renderHook, act } from '@testing-library/react';
import { useNhanVienModel } from '@/models/dichvu';

describe('useNhanVienModel', () => {
  it('should add nhan vien', () => {
    const { result } = renderHook(() => useNhanVienModel());
    
    act(() => {
      result.current.addNhanVien({
        hoTen: 'Test',
        email: 'test@example.com',
        // ...
      });
    });
    
    expect(result.current.nhanViens).toHaveLength(1);
  });
});
```

## 9. Performance Optimization

### Use Memo cho Large Lists

```typescript
const filteredNhanViens = useMemo(() => {
  return nhanViens.filter(nv => nv.trangThai === 'hoat_dong');
}, [nhanViens]);
```

## 10. Deploy

### Build Production

```bash
npm run build
```

Dữ liệu sẽ được lưu trong localStorage của client.

### Backend Requirements (Nếu cần)

API endpoints cần hỗ trợ:
- `GET/POST /api/dichvu/nhanvien`
- `GET/POST /api/dichvu/dichvu`
- `GET/POST /api/dichvu/lichhen`
- `GET/POST /api/dichvu/danhgia`
- `GET /api/dichvu/thongke/*`

---

## Danh Sách Kiểm Tra (Checklist)

- [ ] Route `/dichvu` được thêm vào config
- [ ] Styling được áp dụng đúng
- [ ] localStorage keys được đặt tên hợp lý
- [ ] Error messages được hiển thị đúng
- [ ] Mobile responsive hoạt động
- [ ] Data persistence hoạt động
- [ ] API services được setup sẵn (nếu cần)
- [ ] Components được export đúng
- [ ] Documentation được cập nhật

---

Enjoy! 🎉
