import { useState, useEffect } from 'react';

export type DonHangStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface DonHangProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface DonHang {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: DonHangProduct[];
  totalAmount: number;
  status: DonHangStatus;
  createdAt: string;
}

export interface UseDonHangModel {
  donHangs: DonHang[];
  addDonHang: (donHang: Omit<DonHang, 'id' | 'createdAt'>) => void;
  updateDonHangStatus: (id: string, status: DonHangStatus) => DonHang | undefined;
  getDonHangById: (id: string) => DonHang | undefined;
  deleteDonHang: (id: string) => void;
  getDonHangsByStatus: (status: DonHangStatus) => DonHang[];
  getCompletedOrdersRevenue: () => number;
}

// Initial mock data
const MOCK_DATA: DonHang[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
];

const STORAGE_KEY = 'donhang_data';

export const useDonHangModel = (): UseDonHangModel => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDonHangs(JSON.parse(saved));
      } catch {
        setDonHangs(MOCK_DATA);
      }
    } else {
      setDonHangs(MOCK_DATA);
    }
  }, []);

  // Save to localStorage whenever donHangs changes
  useEffect(() => {
    if (donHangs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(donHangs));
    }
  }, [donHangs]);

  const addDonHang = (newDonHang: Omit<DonHang, 'id' | 'createdAt'>) => {
    const id = `DH${String(Math.max(...donHangs.map(dh => {
      const num = parseInt(dh.id.replace('DH', ''), 10);
      return isNaN(num) ? 0 : num;
    }), 0) + 1).padStart(3, '0')}`;
    
    const createdAt = new Date().toISOString().split('T')[0];
    
    setDonHangs([...donHangs, { ...newDonHang, id, createdAt }]);
  };

  const updateDonHangStatus = (id: string, status: DonHangStatus): DonHang | undefined => {
    let updatedDonHang: DonHang | undefined;
    setDonHangs(
      donHangs.map(dh => {
        if (dh.id === id) {
          updatedDonHang = { ...dh, status };
          return updatedDonHang;
        }
        return dh;
      })
    );
    return updatedDonHang;
  };

  const getDonHangById = (id: string): DonHang | undefined => {
    return donHangs.find(dh => dh.id === id);
  };

  const deleteDonHang = (id: string) => {
    setDonHangs(donHangs.filter(dh => dh.id !== id));
  };

  const getDonHangsByStatus = (status: DonHangStatus): DonHang[] => {
    return donHangs.filter(dh => dh.status === status);
  };

  const getCompletedOrdersRevenue = (): number => {
    return donHangs
      .filter(dh => dh.status === 'Hoàn thành')
      .reduce((sum, dh) => sum + dh.totalAmount, 0);
  };

  return {
    donHangs,
    addDonHang,
    updateDonHangStatus,
    getDonHangById,
    deleteDonHang,
    getDonHangsByStatus,
    getCompletedOrdersRevenue,
  };
};
