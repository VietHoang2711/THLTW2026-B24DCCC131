import React from 'react';

// Lịch hẹn model
export type TrangThaiLichHen = 'cho_duyet' | 'xac_nhan' | 'hoan_thanh' | 'huy';

export interface LichHen {
  id: string;
  khachHangId: string;
  khachHangTen: string;
  khachHangSDT: string;
  khachHangEmail: string;
  nhanVienId: string;
  dichVuId: string;
  ngayHen: string; // ISO date
  thoiGianBatDau: string; // "09:00"
  thoiGianKetThuc: string; // "09:30"
  ghiChu: string;
  trangThai: TrangThaiLichHen;
  tienThanhToan: number; // VND
  phuongThucThanhToan: 'tien_mat' | 'card' | 'chuyen_khoan' | 'chua_thanh_toan';
  ngayTao: string;
  ngayCapNhat: string;
  danhGiaId?: string; // Link to DanhGia
}

export interface UseLichHenModel {
  lichHens: LichHen[];
  addLichHen: (lichHen: Omit<LichHen, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
  updateTrangThaiLichHen: (id: string, trangThai: TrangThaiLichHen) => void;
  getLichHenById: (id: string) => LichHen | undefined;
  getLichHenByNhanVienVaNgay: (nhanVienId: string, ngay: string) => LichHen[];
  getLichHenByKhachHang: (khachHangId: string) => LichHen[];
  kiemTraLichTrung: (nhanVienId: string, ngayHen: string, thoiGianBatDau: string, thoiGianKetThuc: string, excludeId?: string) => boolean;
  huyLichHen: (id: string, lyDo: string) => void;
  getLichHenTheoTrangThai: (trangThai: TrangThaiLichHen) => LichHen[];
}

const MOCK_LICH_HEN: LichHen[] = [
  {
    id: 'lh001',
    khachHangId: 'kh001',
    khachHangTen: 'Trần Văn A',
    khachHangSDT: '0909000001',
    khachHangEmail: 'vana@example.com',
    nhanVienId: 'nv001',
    dichVuId: 'sv001',
    ngayHen: new Date('2024-03-20').toISOString(),
    thoiGianBatDau: '09:00',
    thoiGianKetThuc: '09:20',
    ghiChu: 'Cắt kiểu cổ điển',
    trangThai: 'xac_nhan',
    tienThanhToan: 50000,
    phuongThucThanhToan: 'tien_mat',
    ngayTao: new Date('2024-03-15').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'lh002',
    khachHangId: 'kh002',
    khachHangTen: 'Phạm Thị B',
    khachHangSDT: '0909000002',
    khachHangEmail: 'thiB@example.com',
    nhanVienId: 'nv002',
    dichVuId: 'sv002',
    ngayHen: new Date('2024-03-21').toISOString(),
    thoiGianBatDau: '14:00',
    thoiGianKetThuc: '15:00',
    ghiChu: 'Massage toàn thân',
    trangThai: 'xac_nhan',
    tienThanhToan: 300000,
    phuongThucThanhToan: 'card',
    ngayTao: new Date('2024-03-10').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'lichhen_data';

export const useLichHenModel = (): UseLichHenModel => {
  const [lichHens, setLichHens] = React.useState<LichHen[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLichHens(JSON.parse(saved));
      } catch {
        setLichHens(MOCK_LICH_HEN);
      }
    } else {
      setLichHens(MOCK_LICH_HEN);
    }
  }, []);

  const saveToStorage = (data: LichHen[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    lichHens,
    addLichHen: (lichHen) => {
      const newLichHen: LichHen = {
        ...lichHen,
        id: `lh${Date.now()}`,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...lichHens, newLichHen];
      setLichHens(updated);
      saveToStorage(updated);
    },
    updateTrangThaiLichHen: (id, trangThai) => {
      const updated = lichHens.map((lh) =>
        lh.id === id ? { ...lh, trangThai, ngayCapNhat: new Date().toISOString() } : lh
      );
      setLichHens(updated);
      saveToStorage(updated);
    },
    getLichHenById: (id) => lichHens.find((lh) => lh.id === id),
    getLichHenByNhanVienVaNgay: (nhanVienId, ngay) =>
      lichHens.filter(
        (lh) =>
          lh.nhanVienId === nhanVienId &&
          lh.ngayHen.startsWith(ngay) &&
          lh.trangThai !== 'huy'
      ),
    getLichHenByKhachHang: (khachHangId) =>
      lichHens.filter((lh) => lh.khachHangId === khachHangId),
    kiemTraLichTrung: (nhanVienId, ngayHen, thoiGianBatDau, thoiGianKetThuc, excludeId) => {
      const lichHenNgayDo = lichHens.filter(
        (lh) =>
          lh.nhanVienId === nhanVienId &&
          lh.ngayHen.startsWith(ngayHen.split('T')[0]) &&
          lh.trangThai !== 'huy' &&
          lh.id !== excludeId
      );

      return lichHenNgayDo.some((lh) => {
        const start1 = parseInt(thoiGianBatDau.replace(':', ''));
        const end1 = parseInt(thoiGianKetThuc.replace(':', ''));
        const start2 = parseInt(lh.thoiGianBatDau.replace(':', ''));
        const end2 = parseInt(lh.thoiGianKetThuc.replace(':', ''));
        return start1 < end2 && end1 > start2;
      });
    },
    huyLichHen: (id, lyDo) => {
      const updated = lichHens.map((lh) =>
        lh.id === id
          ? {
              ...lh,
              trangThai: 'huy' as TrangThaiLichHen,
              ghiChu: `${lh.ghiChu} [HỦY: ${lyDo}]`,
              ngayCapNhat: new Date().toISOString(),
            }
          : lh
      );
      setLichHens(updated);
      saveToStorage(updated);
    },
    getLichHenTheoTrangThai: (trangThai) => lichHens.filter((lh) => lh.trangThai === trangThai),
  };
};
