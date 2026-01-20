import { useState } from 'react';

export interface SanPham {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface UseSanPhamModel {
  sanPhams: SanPham[];
  addSanPham: (sanPham: Omit<SanPham, 'id'>) => void;
  deleteSanPham: (id: number) => void;
  getSanPhamById: (id: number) => SanPham | undefined;
  updateSanPham: (id: number, sanPham: Partial<SanPham>) => void;
}

// Initial mock data
const MOCK_DATA: SanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export const useSanPhamModel = (): UseSanPhamModel => {
  const [sanPhams, setSanPhams] = useState<SanPham[]>(MOCK_DATA);

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

  return {
    sanPhams,
    addSanPham,
    deleteSanPham,
    getSanPhamById,
    updateSanPham,
  };
};
