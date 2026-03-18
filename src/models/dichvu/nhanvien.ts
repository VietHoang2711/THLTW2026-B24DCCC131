import React from 'react';

// Nhân viên model
export interface LichLamViec {
  thu: number; // 1-7 (Thứ 2 - Chủ nhật)
  thoiGianBatDau: string; // "09:00"
  thoiGianKetThuc: string; // "17:00"
  loai: 'thuong' | 'ngay_nghi'; // loại lịch
}

export interface TaiKhoanNhanVien {
  id: string;
  email: string;
  password: string;
  quyen: 'nhanvien' | 'truong_nhom' | 'admin';
}

export interface NhanVien {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  chuyenMon: string[]; // Danh sách ID dịch vụ mà nhân viên có thể làm
  soKhachToiDa: number; // Số khách tối đa phục vụ/ngày
  lichLamViec: Map<number, LichLamViec>; // Key: day of week
  diem: number; // Điểm đánh giá trung bình
  quantamDanhGia: number; // Số lượng đánh giá
  trangThai: 'hoat_dong' | 'tam_ngung' | 'nghi_phep';
  taiKhoan?: TaiKhoanNhanVien;
  ngayThamGia: string; // ISO date
  ngayCapNhat: string; // ISO date
}

export interface UseNhanVienModel {
  nhanViens: NhanVien[];
  addNhanVien: (nhanVien: Omit<NhanVien, 'id' | 'diem' | 'quantamDanhGia' | 'ngayThamGia' | 'ngayCapNhat'>) => void;
  updateNhanVien: (id: string, nhanVien: Partial<NhanVien>) => void;
  deleteNhanVien: (id: string) => void;
  getNhanVienById: (id: string) => NhanVien | undefined;
  getNhanVienByChuyenMon: (serviceId: string) => NhanVien[];
  checkLichTrung: (id: string, ngay: Date, thoiGianBatDau: string, thoiGianKetThuc: string) => boolean;
  setDiemNhanVien: (id: string, diem: number) => void;
  getKhachDaPhucVuHomNay: (id: string) => number;
}

const MOCK_LICH_LAM_VIEC: Map<number, LichLamViec> = new Map([
  [2, { thu: 2, thoiGianBatDau: '09:00', thoiGianKetThuc: '17:00', loai: 'thuong' }],
  [3, { thu: 3, thoiGianBatDau: '09:00', thoiGianKetThuc: '17:00', loai: 'thuong' }],
  [4, { thu: 4, thoiGianBatDau: '09:00', thoiGianKetThuc: '17:00', loai: 'thuong' }],
  [5, { thu: 5, thoiGianBatDau: '09:00', thoiGianKetThuc: '17:00', loai: 'thuong' }],
  [6, { thu: 6, thoiGianBatDau: '09:00', thoiGianKetThuc: '17:00', loai: 'thuong' }],
  [7, { thu: 7, thoiGianBatDau: '10:00', thoiGianKetThuc: '18:00', loai: 'thuong' }],
]);

const MOCK_NHAN_VIEN: NhanVien[] = [
  {
    id: 'nv001',
    hoTen: 'Nguyễn Thị Hoa',
    email: 'hoa@example.com',
    soDienThoai: '0901234567',
    chuyenMon: ['sv001', 'sv002'],
    soKhachToiDa: 5,
    lichLamViec: new Map(MOCK_LICH_LAM_VIEC),
    diem: 4.8,
    quantamDanhGia: 25,
    trangThai: 'hoat_dong',
    ngayThamGia: new Date('2024-01-15').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'nv002',
    hoTen: 'Trần Văn Minh',
    email: 'minh@example.com',
    soDienThoai: '0912345678',
    chuyenMon: ['sv001', 'sv003'],
    soKhachToiDa: 4,
    lichLamViec: new Map(MOCK_LICH_LAM_VIEC),
    diem: 4.5,
    quantamDanhGia: 18,
    trangThai: 'hoat_dong',
    ngayThamGia: new Date('2024-02-20').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'nv003',
    hoTen: 'Phạm Thị Huỳnh Như',
    email: 'nhu@example.com',
    soDienThoai: '0923456789',
    chuyenMon: ['sv002', 'sv003'],
    soKhachToiDa: 6,
    lichLamViec: new Map(MOCK_LICH_LAM_VIEC),
    diem: 4.9,
    quantamDanhGia: 32,
    trangThai: 'hoat_dong',
    ngayThamGia: new Date('2023-12-10').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'nhanvien_data';

export const useNhanVienModel = (): UseNhanVienModel => {
  const [nhanViens, setNhanViens] = React.useState<NhanVien[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Convert Maps back
        const convertedData = data.map((nv: any) => ({
          ...nv,
          lichLamViec: new Map(nv.lichLamViec),
        }));
        setNhanViens(convertedData);
      } catch {
        setNhanViens(MOCK_NHAN_VIEN);
      }
    } else {
      setNhanViens(MOCK_NHAN_VIEN);
    }
  }, []);

  const saveToStorage = (data: NhanVien[]) => {
    const dataToSave = data.map((nv) => ({
      ...nv,
      lichLamViec: Array.from(nv.lichLamViec),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  return {
    nhanViens,
    addNhanVien: (nhanVien) => {
      const newNhanVien: NhanVien = {
        ...nhanVien,
        id: `nv${Date.now()}`,
        diem: 0,
        quantamDanhGia: 0,
        ngayThamGia: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...nhanViens, newNhanVien];
      setNhanViens(updated);
      saveToStorage(updated);
    },
    updateNhanVien: (id, data) => {
      const updated = nhanViens.map((nv) =>
        nv.id === id ? { ...nv, ...data, ngayCapNhat: new Date().toISOString() } : nv
      );
      setNhanViens(updated);
      saveToStorage(updated);
    },
    deleteNhanVien: (id) => {
      const updated = nhanViens.filter((nv) => nv.id !== id);
      setNhanViens(updated);
      saveToStorage(updated);
    },
    getNhanVienById: (id) => nhanViens.find((nv) => nv.id === id),
    getNhanVienByChuyenMon: (serviceId) =>
      nhanViens.filter((nv) => nv.chuyenMon.includes(serviceId) && nv.trangThai === 'hoat_dong'),
    checkLichTrung: (id, ngay, thoiGianBatDau, thoiGianKetThuc) => {
      // TODO: Kiểm tra lịch trùng từ lichhen data
      return false;
    },
    setDiemNhanVien: (id, diem) => {
      const nhanVien = nhanViens.find((nv) => nv.id === id);
      if (nhanVien) {
        const diemMoi =
          (nhanVien.diem * nhanVien.quantamDanhGia + diem) / (nhanVien.quantamDanhGia + 1);
        const updated = nhanViens.map((nv) =>
          nv.id === id
            ? {
                ...nv,
                diem: diemMoi,
                quantamDanhGia: nhanVien.quantamDanhGia + 1,
                ngayCapNhat: new Date().toISOString(),
              }
            : nv
        );
        setNhanViens(updated);
        saveToStorage(updated);
      }
    },
    getKhachDaPhucVuHomNay: (id) => {
      // TODO: Tính số khách đã phục vụ hôm nay
      return 0;
    },
  };
};
