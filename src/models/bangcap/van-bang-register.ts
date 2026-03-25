import React from 'react';

// Sổ văn bằng model
export interface VanBangRegister {
  id: string;
  nam: number; // Năm của sổ
  soVanBang: string; // Ví dụ: "2024-001"
  ngayMo: string; // Ngày mở sổ
  trangThai: 'mo' | 'dong'; // Mở hoặc đóng
  soLuongVanBang: number; // Số lượng văn bằng trong sổ
}

export interface UseVanBangRegisterModel {
  registers: VanBangRegister[];
  addRegister: (register: Omit<VanBangRegister, 'id' | 'soLuongVanBang'>) => void;
  updateRegister: (id: string, register: Partial<VanBangRegister>) => void;
  getRegisterByYear: (year: number) => VanBangRegister | undefined;
  getActiveRegister: () => VanBangRegister | undefined;
  closeRegister: (id: string) => void;
  getNextSoVaoBang: (registerId: string) => number;
}

const MOCK_REGISTERS: VanBangRegister[] = [
  {
    id: 'reg001',
    nam: 2024,
    soVanBang: '2024-001',
    ngayMo: new Date('2024-01-15').toISOString(),
    trangThai: 'mo',
    soLuongVanBang: 0,
  },
];

const STORAGE_KEY = 'van_bang_register_data';

export const useVanBangRegisterModel = (): UseVanBangRegisterModel => {
  const [registers, setRegisters] = React.useState<VanBangRegister[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRegisters(JSON.parse(saved));
      } catch {
        setRegisters(MOCK_REGISTERS);
      }
    } else {
      setRegisters(MOCK_REGISTERS);
    }
  }, []);

  const saveToStorage = (data: VanBangRegister[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    registers,
    addRegister: (register) => {
      const newRegister: VanBangRegister = {
        ...register,
        id: `reg${Date.now()}`,
        soLuongVanBang: 0,
      };
      const updated = [...registers, newRegister];
      setRegisters(updated);
      saveToStorage(updated);
    },
    updateRegister: (id, data) => {
      const updated = registers.map((reg) =>
        reg.id === id ? { ...reg, ...data } : reg
      );
      setRegisters(updated);
      saveToStorage(updated);
    },
    getRegisterByYear: (year) => registers.find((reg) => reg.nam === year),
    getActiveRegister: () => registers.find((reg) => reg.trangThai === 'mo'),
    closeRegister: (id) => {
      const updated = registers.map((reg) =>
        reg.id === id ? { ...reg, trangThai: 'dong' } : reg
      );
      setRegisters(updated);
      saveToStorage(updated);
    },
    getNextSoVaoBang: (registerId) => {
      const register = registers.find((r) => r.id === registerId);
      return register ? register.soLuongVanBang + 1 : 1;
    },
  };
};
