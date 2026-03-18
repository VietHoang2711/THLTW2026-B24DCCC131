import React from 'react';

// Dịch vụ model
export interface DichVu {
  id: string;
  tenDichVu: string;
  moTa: string;
  gia: number; // VND
  thoiGianThucHien: number; // Phút
  loaiDichVu: 'cat_toc' | 'spa' | 'kham_benh' | 'sua_chua' | 'khac';
  hinh: string; // URL hình ảnh
  trangThai: 'hoat_dong' | 'tam_ngung';
  trongSoUuTien: number; // 1-10, cao hơn => hiển thị trước
  ngayTao: string;
  ngayCapNhat: string;
}

export interface UseDichVuModel {
  dichVus: DichVu[];
  addDichVu: (dichVu: Omit<DichVu, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
  updateDichVu: (id: string, dichVu: Partial<DichVu>) => void;
  deleteDichVu: (id: string) => void;
  getDichVuById: (id: string) => DichVu | undefined;
  getDichVuByLoai: (loai: DichVu['loaiDichVu']) => DichVu[];
  getDichVuActive: () => DichVu[];
}

const MOCK_DICH_VU: DichVu[] = [
  {
    id: 'sv001',
    tenDichVu: 'Cắt tóc nam cơ bản',
    moTa: 'Cắt tóc nam theo kiểu đơn giản',
    gia: 50000,
    thoiGianThucHien: 20,
    loaiDichVu: 'cat_toc',
    hinh: 'https://via.placeholder.com/200',
    trangThai: 'hoat_dong',
    trongSoUuTien: 8,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'sv002',
    tenDichVu: 'Massage thư giãn',
    moTa: 'Massage toàn thân 60 phút',
    gia: 300000,
    thoiGianThucHien: 60,
    loaiDichVu: 'spa',
    hinh: 'https://via.placeholder.com/200',
    trangThai: 'hoat_dong',
    trongSoUuTien: 9,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'sv003',
    tenDichVu: 'Khám sức khỏe tổng quát',
    moTa: 'Khám sức khỏe toàn diện',
    gia: 500000,
    thoiGianThucHien: 45,
    loaiDichVu: 'kham_benh',
    hinh: 'https://via.placeholder.com/200',
    trangThai: 'hoat_dong',
    trongSoUuTien: 10,
    ngayTao: new Date('2024-01-15').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'sv004',
    tenDichVu: 'Tẩy trắng răng',
    moTa: 'Tẩy trắng răng chuyên nghiệp',
    gia: 200000,
    thoiGianThucHien: 30,
    loaiDichVu: 'khac',
    hinh: 'https://via.placeholder.com/200',
    trangThai: 'hoat_dong',
    trongSoUuTien: 7,
    ngayTao: new Date('2024-02-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'sv005',
    tenDichVu: 'Sửa chữa điện thoại',
    moTa: 'Sửa chữa, thay pin, màn hình',
    gia: 150000,
    thoiGianThucHien: 45,
    loaiDichVu: 'sua_chua',
    hinh: 'https://via.placeholder.com/200',
    trangThai: 'hoat_dong',
    trongSoUuTien: 6,
    ngayTao: new Date('2024-02-10').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'dichvu_data';

export const useDichVuModel = (): UseDichVuModel => {
  const [dichVus, setDichVus] = React.useState<DichVu[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDichVus(JSON.parse(saved));
      } catch {
        setDichVus(MOCK_DICH_VU);
      }
    } else {
      setDichVus(MOCK_DICH_VU);
    }
  }, []);

  const saveToStorage = (data: DichVu[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    dichVus,
    addDichVu: (dichVu) => {
      const newDichVu: DichVu = {
        ...dichVu,
        id: `sv${Date.now()}`,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...dichVus, newDichVu];
      setDichVus(updated);
      saveToStorage(updated);
    },
    updateDichVu: (id, data) => {
      const updated = dichVus.map((dv) =>
        dv.id === id ? { ...dv, ...data, ngayCapNhat: new Date().toISOString() } : dv
      );
      setDichVus(updated);
      saveToStorage(updated);
    },
    deleteDichVu: (id) => {
      const updated = dichVus.filter((dv) => dv.id !== id);
      setDichVus(updated);
      saveToStorage(updated);
    },
    getDichVuById: (id) => dichVus.find((dv) => dv.id === id),
    getDichVuByLoai: (loai) => dichVus.filter((dv) => dv.loaiDichVu === loai && dv.trangThai === 'hoat_dong'),
    getDichVuActive: () => dichVus.filter((dv) => dv.trangThai === 'hoat_dong'),
  };
};
