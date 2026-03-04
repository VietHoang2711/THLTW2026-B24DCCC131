import { useState, useEffect } from 'react';

export interface SanPham {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export type SanPhamStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng';

export interface UseSanPhamModel {
  sanPhams: SanPham[];
  addSanPham: (sanPham: Omit<SanPham, 'id'>) => void;
  deleteSanPham: (id: number) => void;
  getSanPhamById: (id: number) => SanPham | undefined;
  updateSanPham: (id: number, sanPham: Partial<SanPham>) => void;
  getSanPhamStatus: (quantity: number) => SanPhamStatus;
  updateProductQuantity: (id: number, quantityChange: number) => void;
}

// Initial mock data with categories
const MOCK_DATA: SanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const STORAGE_KEY = 'sanpham_data';

export const useSanPhamModel = (): UseSanPhamModel => {
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSanPhams(JSON.parse(saved));
      } catch {
        setSanPhams(MOCK_DATA);
      }
    } else {
      setSanPhams(MOCK_DATA);
    }
  }, []);

  // Save to localStorage whenever sanPhams changes
  useEffect(() => {
    if (sanPhams.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanPhams));
    }
  }, [sanPhams]);

  const getSanPhamStatus = (quantity: number): SanPhamStatus => {
    if (quantity > 10) return 'Còn hàng';
    if (quantity > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  const addSanPham = (newSanPham: Omit<SanPham, 'id'>) => {
    const id = Math.max(...sanPhams.map(sp => sp.id), 0) + 1;
    setSanPhams([...sanPhams, { ...newSanPham, id }]);
  };

  const deleteSanPham = (id: number) => {
    setSanPhams(sanPhams.filter(sp => sp.id !== id));
  };

  const getSanPhamById = (id: number) => {
    return sanPhams.find(sp => sp.id === id);
  };

  const updateSanPham = (id: number, updates: Partial<SanPham>) => {
    setSanPhams(
      sanPhams.map(sp =>
        sp.id === id ? { ...sp, ...updates } : sp
      )
    );
  };

  const updateProductQuantity = (id: number, quantityChange: number) => {
    setSanPhams(
      sanPhams.map(sp =>
        sp.id === id ? { ...sp, quantity: Math.max(0, sp.quantity + quantityChange) } : sp
      )
    );
  };

  return {
    sanPhams,
    addSanPham,
    deleteSanPham,
    getSanPhamById,
    updateSanPham,
    getSanPhamStatus,
    updateProductQuantity,
  };
};
