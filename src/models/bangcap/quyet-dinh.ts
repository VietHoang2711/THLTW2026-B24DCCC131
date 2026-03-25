import React from 'react';

// Quyết định tốt nghiệp model
export interface QuyetDinh {
  id: string;
  soQD: string; // Số quyết định
  ngayBanHanh: string; // Ngày ban hành
  trichYeu: string; // Trích yếu
  vanBangRegisterId: string; // Sổ văn bằng nào
  soLuongSinhVien: number; // Số sinh viên trong quyết định
  ngayTao: string;
  ngayCapNhat: string;
}

export interface UseQuyetDinhModel {
  quyetDinhs: QuyetDinh[];
  addQuyetDinh: (quyetDinh: Omit<QuyetDinh, 'id' | 'ngayTao' | 'ngayCapNhat' | 'soLuongSinhVien'>) => string;
  updateQuyetDinh: (id: string, quyetDinh: Partial<QuyetDinh>) => void;
  deleteQuyetDinh: (id: string) => void;
  getQuyetDinhById: (id: string) => QuyetDinh | undefined;
  getQuyetDinhByRegisterId: (registerId: string) => QuyetDinh[];
  updateSoLuongSinhVien: (id: string, soLuong: number) => void;
}

const MOCK_QUYET_DINH: QuyetDinh[] = [
  {
    id: 'qd001',
    soQD: 'QĐ-2024-001',
    ngayBanHanh: new Date('2024-06-15').toISOString(),
    trichYeu: 'Phê duyệt kết quả tốt nghiệp kỳ I năm 2024',
    vanBangRegisterId: 'reg001',
    soLuongSinhVien: 0,
    ngayTao: new Date('2024-06-15').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'quyet_dinh_data';

export const useQuyetDinhModel = (): UseQuyetDinhModel => {
  const [quyetDinhs, setQuyetDinhs] = React.useState<QuyetDinh[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setQuyetDinhs(JSON.parse(saved));
      } catch {
        setQuyetDinhs(MOCK_QUYET_DINH);
      }
    } else {
      setQuyetDinhs(MOCK_QUYET_DINH);
    }
  }, []);

  const saveToStorage = (data: QuyetDinh[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    quyetDinhs,
    addQuyetDinh: (quyetDinh) => {
      const newQuyetDinh: QuyetDinh = {
        ...quyetDinh,
        id: `qd${Date.now()}`,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
        soLuongSinhVien: 0,
      };
      const updated = [...quyetDinhs, newQuyetDinh];
      setQuyetDinhs(updated);
      saveToStorage(updated);
      return newQuyetDinh.id;
    },
    updateQuyetDinh: (id, data) => {
      const updated = quyetDinhs.map((qd) =>
        qd.id === id ? { ...qd, ...data, ngayCapNhat: new Date().toISOString() } : qd
      );
      setQuyetDinhs(updated);
      saveToStorage(updated);
    },
    deleteQuyetDinh: (id) => {
      const updated = quyetDinhs.filter((qd) => qd.id !== id);
      setQuyetDinhs(updated);
      saveToStorage(updated);
    },
    getQuyetDinhById: (id) => quyetDinhs.find((qd) => qd.id === id),
    getQuyetDinhByRegisterId: (registerId) =>
      quyetDinhs.filter((qd) => qd.vanBangRegisterId === registerId),
    updateSoLuongSinhVien: (id, soLuong) => {
      const updated = quyetDinhs.map((qd) =>
        qd.id === id ? { ...qd, soLuongSinhVien: soLuong } : qd
      );
      setQuyetDinhs(updated);
      saveToStorage(updated);
    },
  };
};
