# 📚 Tài liệu API & Models

## Models

### 🛍️ SanPham Model

#### Interfaces

```typescript
interface SanPham {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

type SanPhamStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng';

interface UseSanPhamModel {
  sanPhams: SanPham[];
  addSanPham: (sanPham: Omit<SanPham, 'id'>) => void;
  deleteSanPham: (id: number) => void;
  getSanPhamById: (id: number) => SanPham | undefined;
  updateSanPham: (id: number, sanPham: Partial<SanPham>) => void;
  getSanPhamStatus: (quantity: number) => SanPhamStatus;
  updateProductQuantity: (id: number, quantityChange: number) => void;
}
```

#### Hook: `useSanPhamModel()`

**Trả về**: `UseSanPhamModel`

**Các hàm**:

1. **`addSanPham(sanPham: Omit<SanPham, 'id'>): void`**
   - Thêm sản phẩm mới
   - ID sẽ được tự động tạo
   ```typescript
   addSanPham({
     name: 'New Product',
     category: 'Laptop',
     price: 5000000,
     quantity: 10
   });
   ```

2. **`deleteSanPham(id: number): void`**
   - Xóa sản phẩm theo ID
   ```typescript
   deleteSanPham(1);
   ```

3. **`getSanPhamById(id: number): SanPham | undefined`**
   - Lấy sản phẩm theo ID
   ```typescript
   const product = getSanPhamById(1);
   ```

4. **`updateSanPham(id: number, updates: Partial<SanPham>): void`**
   - Cập nhật sản phẩm
   ```typescript
   updateSanPham(1, { name: 'Updated Name', price: 6000000 });
   ```

5. **`getSanPhamStatus(quantity: number): SanPhamStatus`**
   - Xác định trạng thái sản phẩm dựa trên số lượng
   - quantity > 10 → "Còn hàng"
   - quantity 1-10 → "Sắp hết"
   - quantity = 0 → "Hết hàng"
   ```typescript
   const status = getSanPhamStatus(15); // 'Còn hàng'
   ```

6. **`updateProductQuantity(id: number, quantityChange: number): void`**
   - Cập nhật số lượng (có thể âm để giảm)
   ```typescript
   updateProductQuantity(1, -5); // Giảm 5
   updateProductQuantity(1, 10); // Tăng 10
   ```

#### Local Storage
- **Key**: `sanpham_data`
- **Format**: JSON array of SanPham objects
- **Tự động lưu**: Khi dữ liệu thay đổi
- **Tự động tải**: Khi component mount

---

### 📦 DonHang Model

#### Interfaces

```typescript
type DonHangStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

interface DonHangProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface DonHang {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: DonHangProduct[];
  totalAmount: number;
  status: DonHangStatus;
  createdAt: string; // YYYY-MM-DD
}

interface UseDonHangModel {
  donHangs: DonHang[];
  addDonHang: (donHang: Omit<DonHang, 'id' | 'createdAt'>) => void;
  updateDonHangStatus: (id: string, status: DonHangStatus) => DonHang | undefined;
  getDonHangById: (id: string) => DonHang | undefined;
  deleteDonHang: (id: string) => void;
  getDonHangsByStatus: (status: DonHangStatus) => DonHang[];
  getCompletedOrdersRevenue: () => number;
}
```

#### Hook: `useDonHangModel()`

**Trả về**: `UseDonHangModel`

**Các hàm**:

1. **`addDonHang(donHang: Omit<DonHang, 'id' | 'createdAt'>): void`**
   - Tạo đơn hàng mới
   - ID sẽ được tự động tạo (DH001, DH002, ...)
   - createdAt sẽ được tự động set thành ngày hôm nay
   ```typescript
   addDonHang({
     customerName: 'Nguyễn Văn A',
     phone: '0912345678',
     address: '123 Nguyễn Huệ',
     products: [{ productId: 1, productName: 'Laptop', quantity: 1, price: 25000000 }],
     totalAmount: 25000000,
     status: 'Chờ xử lý'
   });
   ```

2. **`updateDonHangStatus(id: string, status: DonHangStatus): DonHang | undefined`**
   - Cập nhật trạng thái đơn hàng
   - Trả về đơn hàng đã cập nhật
   ```typescript
   const order = updateDonHangStatus('DH001', 'Hoàn thành');
   ```

3. **`getDonHangById(id: string): DonHang | undefined`**
   - Lấy đơn hàng theo ID
   ```typescript
   const order = getDonHangById('DH001');
   ```

4. **`deleteDonHang(id: string): void`**
   - Xóa đơn hàng
   ```typescript
   deleteDonHang('DH001');
   ```

5. **`getDonHangsByStatus(status: DonHangStatus): DonHang[]`**
   - Lấy danh sách đơn hàng theo trạng thái
   ```typescript
   const completed = getDonHangsByStatus('Hoàn thành');
   const pending = getDonHangsByStatus('Chờ xử lý');
   ```

6. **`getCompletedOrdersRevenue(): number`**
   - Tính doanh thu từ các đơn hàng "Hoàn thành"
   ```typescript
   const revenue = getCompletedOrdersRevenue(); // 1500000000
   ```

#### Local Storage
- **Key**: `donhang_data`
- **Format**: JSON array of DonHang objects
- **Tự động lưu**: Khi dữ liệu thay đổi
- **Tự động tải**: Khi component mount

---

## 🎨 Components

### AddSanPhamModal

**Props:**
```typescript
interface AddSanPhamModalProps extends Omit<ModalProps, 'onOk'> {
  onOk: (values: Omit<SanPham, 'id'>) => void;
  loading?: boolean;
}
```

**Cách sử dụng:**
```typescript
const { addSanPham } = useSanPhamModel();
const [visible, setVisible] = useState(false);

<AddSanPhamModal
  visible={visible}
  onOk={(values) => {
    addSanPham(values);
    setVisible(false);
  }}
  onCancel={() => setVisible(false)}
  loading={false}
/>
```

### EditSanPhamModal

**Props:**
```typescript
interface EditSanPhamModalProps extends Omit<ModalProps, 'onOk'> {
  product: SanPham;
  onOk: (values: Omit<SanPham, 'id'>) => void;
  loading?: boolean;
}
```

**Cách sử dụng:**
```typescript
const { updateSanPham } = useSanPhamModel();
const [editProduct, setEditProduct] = useState<SanPham | null>(null);

<EditSanPhamModal
  visible={!!editProduct}
  product={editProduct!}
  onOk={(values) => {
    updateSanPham(editProduct!.id, values);
    setEditProduct(null);
  }}
  onCancel={() => setEditProduct(null)}
/>
```

### CreateDonHangModal

**Props:**
```typescript
interface CreateDonHangModalProps extends Omit<ModalProps, 'onOk'> {
  products: SanPham[];
  onOk: (values: any) => void;
}
```

**Form Values:**
```typescript
{
  customerName: string;
  phone: string;
  address: string;
  products: number[]; // IDs
  quantity_[productId]: number; // Cho mỗi sản phẩm
}
```

**Cách sử dụng:**
```typescript
const { addDonHang } = useDonHangModel();
const { sanPhams } = useSanPhamModel();

<CreateDonHangModal
  visible={isVisible}
  products={sanPhams}
  onOk={(values) => {
    // Convert form values to DonHang
    // và gọi addDonHang
  }}
  onCancel={() => setIsVisible(false)}
/>
```

---

## 📊 Dữ liệu mẫu

### SanPham[]
```typescript
[
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  // ... more
]
```

### DonHang[]
```typescript
[
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
]
```

---

## 🎯 Use Cases

### Ví dụ 1: Tạo đơn hàng và cập nhật kho

```typescript
const { addDonHang, updateDonHangStatus } = useDonHangModel();
const { updateProductQuantity } = useSanPhamModel();

// Tạo đơn hàng
addDonHang({
  customerName: 'Khách hàng A',
  phone: '0912345678',
  address: 'Địa chỉ A',
  products: [/* ... */],
  totalAmount: 50000000,
  status: 'Chờ xử lý'
});

// Cập nhật trạng thái thành Hoàn thành
updateDonHangStatus('DH001', 'Hoàn thành');

// ⚠️ Người dùng cần tự gọi updateProductQuantity để trừ kho
// (hoặc có thể implement trong hàm cập nhật trạng thái)
```

### Ví dụ 2: Lấy thống kê

```typescript
const { donHangs, getDonHangsByStatus, getCompletedOrdersRevenue } = useDonHangModel();

// Đơn hàng chờ xử lý
const pending = getDonHangsByStatus('Chờ xử lý');

// Doanh thu
const revenue = getCompletedOrdersRevenue();

// Tổng đơn hàng
const total = donHangs.length;
```

### Ví dụ 3: Lọc sản phẩm

```typescript
const { sanPhams, getSanPhamStatus } = useSanPhamModel();

// Sản phẩm sắp hết
const lowStock = sanPhams.filter(
  sp => getSanPhamStatus(sp.quantity) === 'Sắp hết'
);

// Sản phẩm hết hàng
const outOfStock = sanPhams.filter(
  sp => getSanPhamStatus(sp.quantity) === 'Hết hàng'
);

// Sản phẩm theo danh mục
const laptops = sanPhams.filter(sp => sp.category === 'Laptop');
```

---

## ⚙️ Validation Rules

### SanPham Validation
- `name`: required, non-empty
- `category`: required, one of [Laptop, Điện thoại, Máy tính bảng, Phụ kiện]
- `price`: required, > 0
- `quantity`: required, >= 0

### DonHang Validation
- `customerName`: required, non-empty
- `phone`: required, regex: /^(0\d{9}|0\d{10})$/
- `address`: required, non-empty
- `products`: required, length > 0
- `quantity`: required, > 0, <= product.quantity

---

## 🔄 Data Flow

```
User Action
    ↓
Component Handler
    ↓
Model Hook (setState)
    ↓
Component Re-render
    ↓
useEffect (save to localStorage)
```

**localStorage** ↔️ **State** ↔️ **UI**

---

## 📝 Notes

- Tất cả models sử dụng `localStorage` tự động
- Data persists across browser sessions
- Clearing localStorage sẽ reset dữ liệu
- IDs được tạo tự động (không cần truyền)
- Validation được thực hiện ở component level
- Models chỉ update state, không validate

---

**Version**: 1.0.0
