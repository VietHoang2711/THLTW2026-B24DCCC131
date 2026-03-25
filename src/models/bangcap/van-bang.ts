import React from 'react';

// Thông tin văn bằng
export interface VanBang {
  id: string;
  soVaoBang: number; // Số vào sổ (auto-increment)
  soHieuVanBang: string; // Số hiệu văn bằng
  maSinhVien: string; // Mã sinh viên
  hoTen: string; // Họ tên
  ngaySinh: string; // Ngày sinh (default)
  quyetDinhId: string; // Thuộc quyết định nào
  vanBangRegisterId: string; // Thuộc sổ văn bằng nào
  chuThichThemTheoForm: Record<string, any>; // Thông tin bổ sung theo cấu hình form
  ngayTao: string;
  ngayCapNhat: string;
}

export interface UseVanBangModel {
  vanBangs: VanBang[];
  addVanBang: (
    vanBang: Omit<VanBang, 'id' | 'soVaoBang' | 'ngayTao' | 'ngayCapNhat'>,
    registerId: string
  ) => void;
  updateVanBang: (id: string, vanBang: Partial<Omit<VanBang, 'soVaoBang' | 'soHieuVanBang'>>) => void;
  deleteVanBang: (id: string) => void;
  getVanBangById: (id: string) => VanBang | undefined;
  getVanBangByRegisterId: (registerId: string) => VanBang[];
  getVanBangByQuyetDinhId: (quyetDinhId: string) => VanBang[];
  getVanBangBySoHieuVanBang: (soHieuVanBang: string) => VanBang | undefined;
  getVanBangByMaSinhVien: (maSinhVien: string) => VanBang[];
  getVanBangByHoTen: (hoTen: string) => VanBang[];
  getVanBangByNgaySinh: (ngaySinh: string) => VanBang[];
}

const MOCK_VAN_BANG: VanBang[] = [
  {
    id: 'vb001',
    soVaoBang: 1,
    soHieuVanBang: '2024-001',
    maSinhVien: 'SV001',
    hoTen: 'Nguyễn Văn A',
    ngaySinh: new Date('2000-01-15').toISOString(),
    quyetDinhId: 'qd001',
    vanBangRegisterId: 'reg001',
    chuThichThemTheoForm: {
      danToc: 'Kinh',
      noiSinh: 'Hà Nội',
      diemTrungBinh: 3.5,
      ngayNhapHoc: new Date('2020-09-01').toISOString(),
    },
    ngayTao: new Date('2024-06-15').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'van_bang_data';

export const useVanBangModel = (): UseVanBangModel => {
  const [vanBangs, setVanBangs] = React.useState<VanBang[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setVanBangs(JSON.parse(saved));
      } catch {
        setVanBangs(MOCK_VAN_BANG);
      }
    } else {
      setVanBangs(MOCK_VAN_BANG);
    }
  }, []);

  const saveToStorage = (data: VanBang[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    vanBangs,
    addVanBang: (vanBang, registerId) => {
      const existingInRegister = vanBangs.filter((vb) => vb.vanBangRegisterId === registerId);
      const nextSoVaoBang = existingInRegister.length + 1;

      const newVanBang: VanBang = {
        ...vanBang,
        id: `vb${Date.now()}`,
        soVaoBang: nextSoVaoBang,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...vanBangs, newVanBang];
      setVanBangs(updated);
      saveToStorage(updated);
    },
    updateVanBang: (id, data) => {
      const updated = vanBangs.map((vb) =>
        vb.id === id ? { ...vb, ...data, ngayCapNhat: new Date().toISOString() } : vb
      );
      setVanBangs(updated);
      saveToStorage(updated);
    },
    deleteVanBang: (id) => {
      const updated = vanBangs.filter((vb) => vb.id !== id);
      setVanBangs(updated);
      saveToStorage(updated);
    },
    getVanBangById: (id) => vanBangs.find((vb) => vb.id === id),
    getVanBangByRegisterId: (registerId) =>
      vanBangs.filter((vb) => vb.vanBangRegisterId === registerId),
    getVanBangByQuyetDinhId: (quyetDinhId) =>
      vanBangs.filter((vb) => vb.quyetDinhId === quyetDinhId),
    getVanBangBySoHieuVanBang: (soHieuVanBang) =>
      vanBangs.find((vb) => vb.soHieuVanBang === soHieuVanBang),
    getVanBangByMaSinhVien: (maSinhVien) =>
      vanBangs.filter((vb) => vb.maSinhVien.includes(maSinhVien)),
    getVanBangByHoTen: (hoTen) =>
      vanBangs.filter((vb) => vb.hoTen.toLowerCase().includes(hoTen.toLowerCase())),
    getVanBangByNgaySinh: (ngaySinh) =>
      vanBangs.filter((vb) => vb.ngaySinh === ngaySinh),
  };
};
