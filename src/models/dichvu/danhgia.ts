import React from 'react';

// Đánh giá model
export interface DanhGia {
  id: string;
  lichHenId: string;
  nhanVienId: string;
  khachHangId: string;
  khachHangTen: string;
  diem: number; // 1-5
  tieuDe: string;
  nhanXet: string;
  anhDinhKem: string[]; // URL images
  phanHoiNhanVien?: string;
  trangThaiPhanHoi: 'chua_phan_hoi' | 'da_phan_hoi';
  ngayDanhGia: string;
  ngayCapNhat: string;
}

export interface UseDanhGiaModel {
  danhGias: DanhGia[];
  addDanhGia: (danhGia: Omit<DanhGia, 'id' | 'ngayDanhGia' | 'ngayCapNhat' | 'trangThaiPhanHoi'>) => string;
  updateDanhGia: (id: string, danhGia: Partial<DanhGia>) => void;
  getDanhGiaById: (id: string) => DanhGia | undefined;
  getDanhGiaByNhanVien: (nhanVienId: string) => DanhGia[];
  getDanhGiaByLichHen: (lichHenId: string) => DanhGia | undefined;
  phanHoiDanhGia: (id: string, phanHoi: string) => void;
  getDiemTrungBinhNhanVien: (nhanVienId: string) => number;
}

const MOCK_DANH_GIA: DanhGia[] = [
  {
    id: 'dg001',
    lichHenId: 'lh001',
    nhanVienId: 'nv001',
    khachHangId: 'kh001',
    khachHangTen: 'Trần Văn A',
    diem: 5,
    tieuDe: 'Dịch vụ xuất sắc',
    nhanXet: 'Nhân viên rất chuyên nghiệp, cắt tóc đẹp và chuẩn',
    anhDinhKem: [],
    phanHoiNhanVien: 'Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!',
    trangThaiPhanHoi: 'da_phan_hoi',
    ngayDanhGia: new Date('2024-03-21').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'dg002',
    lichHenId: 'lh002',
    nhanVienId: 'nv002',
    khachHangId: 'kh002',
    khachHangTen: 'Phạm Thị B',
    diem: 4,
    tieuDe: 'Massage thoải mái',
    nhanXet: 'Dịch vụ tốt, nhưng giá hơi cao',
    anhDinhKem: [],
    trangThaiPhanHoi: 'chua_phan_hoi',
    ngayDanhGia: new Date('2024-03-22').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'danhgia_data';

export const useDanhGiaModel = (): UseDanhGiaModel => {
  const [danhGias, setDanhGias] = React.useState<DanhGia[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDanhGias(JSON.parse(saved));
      } catch {
        setDanhGias(MOCK_DANH_GIA);
      }
    } else {
      setDanhGias(MOCK_DANH_GIA);
    }
  }, []);

  const saveToStorage = (data: DanhGia[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    danhGias,
    addDanhGia: (danhGia) => {
      const newDanhGia: DanhGia = {
        ...danhGia,
        id: `dg${Date.now()}`,
        trangThaiPhanHoi: 'chua_phan_hoi',
        ngayDanhGia: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...danhGias, newDanhGia];
      setDanhGias(updated);
      saveToStorage(updated);
      return newDanhGia.id;
    },
    updateDanhGia: (id, data) => {
      const updated = danhGias.map((dg) =>
        dg.id === id ? { ...dg, ...data, ngayCapNhat: new Date().toISOString() } : dg
      );
      setDanhGias(updated);
      saveToStorage(updated);
    },
    getDanhGiaById: (id) => danhGias.find((dg) => dg.id === id),
    getDanhGiaByNhanVien: (nhanVienId) => danhGias.filter((dg) => dg.nhanVienId === nhanVienId),
    getDanhGiaByLichHen: (lichHenId) => danhGias.find((dg) => dg.lichHenId === lichHenId),
    phanHoiDanhGia: (id, phanHoi) => {
      const updated = danhGias.map((dg) =>
        dg.id === id
          ? {
              ...dg,
              phanHoiNhanVien: phanHoi,
              trangThaiPhanHoi: 'da_phan_hoi',
              ngayCapNhat: new Date().toISOString(),
            }
          : dg
      );
      setDanhGias(updated);
      saveToStorage(updated);
    },
    getDiemTrungBinhNhanVien: (nhanVienId) => {
      const danhGiaList = danhGias.filter((dg) => dg.nhanVienId === nhanVienId);
      if (danhGiaList.length === 0) return 0;
      const tongDiem = danhGiaList.reduce((sum, dg) => sum + dg.diem, 0);
      return parseFloat((tongDiem / danhGiaList.length).toFixed(1));
    },
  };
};
