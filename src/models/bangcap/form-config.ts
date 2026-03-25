import React from 'react';

// Cấu hình trường biểu mẫu phụ lục văn bằng
export type FieldDataType = 'string' | 'number' | 'date';

export interface FormFieldConfig {
  id: string;
  tenTruong: string; // Tên trường (Dân tộc, Nơi sinh...)
  kieuDuLieu: FieldDataType; // String, Number, Date
  batBuoc: boolean; // Có bắt buộc hay không
  thuTuHienThi: number; // Thứ tự hiển thị
  ngayTao: string;
  ngayCapNhat: string;
}

export interface UseFormConfigModel {
  configs: FormFieldConfig[];
  addFieldConfig: (config: Omit<FormFieldConfig, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
  updateFieldConfig: (id: string, config: Partial<FormFieldConfig>) => void;
  deleteFieldConfig: (id: string) => void;
  getFieldConfigById: (id: string) => FormFieldConfig | undefined;
  getFieldConfigs: () => FormFieldConfig[];
  getFieldConfigsByType: (type: FieldDataType) => FormFieldConfig[];
}

const MOCK_CONFIG: FormFieldConfig[] = [
  {
    id: 'fc001',
    tenTruong: 'Dân tộc',
    kieuDuLieu: 'string',
    batBuoc: true,
    thuTuHienThi: 1,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'fc002',
    tenTruong: 'Nơi sinh',
    kieuDuLieu: 'string',
    batBuoc: false,
    thuTuHienThi: 2,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'fc003',
    tenTruong: 'Điểm trung bình',
    kieuDuLieu: 'number',
    batBuoc: true,
    thuTuHienThi: 3,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'fc004',
    tenTruong: 'Ngày nhập học',
    kieuDuLieu: 'date',
    batBuoc: true,
    thuTuHienThi: 4,
    ngayTao: new Date('2024-01-01').toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'form_config_data';

export const useFormConfigModel = (): UseFormConfigModel => {
  const [configs, setConfigs] = React.useState<FormFieldConfig[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfigs(JSON.parse(saved));
      } catch {
        setConfigs(MOCK_CONFIG);
      }
    } else {
      setConfigs(MOCK_CONFIG);
    }
  }, []);

  const saveToStorage = (data: FormFieldConfig[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    configs,
    addFieldConfig: (config) => {
      const newConfig: FormFieldConfig = {
        ...config,
        id: `fc${Date.now()}`,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      };
      const updated = [...configs, newConfig];
      setConfigs(updated);
      saveToStorage(updated);
    },
    updateFieldConfig: (id, data) => {
      const updated = configs.map((cfg) =>
        cfg.id === id ? { ...cfg, ...data, ngayCapNhat: new Date().toISOString() } : cfg
      );
      setConfigs(updated);
      saveToStorage(updated);
    },
    deleteFieldConfig: (id) => {
      const updated = configs.filter((cfg) => cfg.id !== id);
      setConfigs(updated);
      saveToStorage(updated);
    },
    getFieldConfigById: (id) => configs.find((cfg) => cfg.id === id),
    getFieldConfigs: () => configs.sort((a, b) => a.thuTuHienThi - b.thuTuHienThi),
    getFieldConfigsByType: (type) =>
      configs.filter((cfg) => cfg.kieuDuLieu === type).sort((a, b) => a.thuTuHienThi - b.thuTuHienThi),
  };
};
