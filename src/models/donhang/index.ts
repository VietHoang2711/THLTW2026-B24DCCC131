import { useState, useEffect } from 'react';

export type DonHangStatus = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

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
	updateDonHang: (id: string, updates: Partial<Omit<DonHang, 'id' | 'createdAt'>>) => DonHang | undefined;
	updateDonHangStatus: (id: string, status: DonHangStatus) => DonHang | undefined;
	getDonHangById: (id: string) => DonHang | undefined;
	deleteDonHang: (id: string) => boolean;
	getDonHangsByStatus: (status: DonHangStatus) => DonHang[];
	getCompletedOrdersRevenue: () => number;
	searchDonHang: (keyword: string) => DonHang[];
	isDonHangIdExists: (id: string) => boolean;
	canCancelOrder: (status: DonHangStatus) => boolean;
}

// Initial mock data
const MOCK_DATA: DonHang[] = [
	{
		id: 'DH001',
		customerName: 'Nguyễn Văn A',
		phone: '0912345678',
		address: '123 Nguyễn Huệ, Q1, TP.HCM',
		products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
		totalAmount: 25000000,
		status: 'Chờ xác nhận',
		createdAt: '2024-01-15',
	},
	{
		id: 'DH002',
		customerName: 'Trần Thị B',
		phone: '0987654321',
		address: '456 Lê Lợi, Q3, TP.HCM',
		products: [
			{ productId: 2, productName: 'iPhone 15 Pro Max', quantity: 1, price: 30000000 },
			{ productId: 8, productName: 'Logitech MX Master 3', quantity: 2, price: 2500000 },
		],
		totalAmount: 35000000,
		status: 'Đang giao',
		createdAt: '2024-01-14',
	},
	{
		id: 'DH003',
		customerName: 'Phạm Văn C',
		phone: '0933333333',
		address: '789 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
		products: [{ productId: 3, productName: 'Samsung Galaxy S24', quantity: 1, price: 22000000 }],
		totalAmount: 22000000,
		status: 'Hoàn thành',
		createdAt: '2024-01-10',
	},
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
		const id = `DH${String(
			Math.max(
				...donHangs.map((dh) => {
					const num = parseInt(dh.id.replace('DH', ''), 10);
					return isNaN(num) ? 0 : num;
				}),
				0,
			) + 1,
		).padStart(3, '0')}`;

		const createdAt = new Date().toISOString().split('T')[0];

		setDonHangs([...donHangs, { ...newDonHang, id, createdAt }]);
	};

	const updateDonHangStatus = (id: string, status: DonHangStatus): DonHang | undefined => {
		let updatedDonHang: DonHang | undefined;
		setDonHangs(
			donHangs.map((dh) => {
				if (dh.id === id) {
					updatedDonHang = { ...dh, status };
					return updatedDonHang;
				}
				return dh;
			}),
		);
		return updatedDonHang;
	};

	const getDonHangById = (id: string): DonHang | undefined => {
		return donHangs.find((dh) => dh.id === id);
	};

	const deleteDonHang = (id: string): boolean => {
		const exists = donHangs.some((dh) => dh.id === id);
		if (exists) {
			setDonHangs(donHangs.filter((dh) => dh.id !== id));
		}
		return exists;
	};

	const getDonHangsByStatus = (status: DonHangStatus): DonHang[] => {
		return donHangs.filter((dh) => dh.status === status);
	};

	const getCompletedOrdersRevenue = (): number => {
		return donHangs.filter((dh) => dh.status === 'Hoàn thành').reduce((sum, dh) => sum + dh.totalAmount, 0);
	};

	const updateDonHangData = (id: string, updates: Partial<Omit<DonHang, 'id' | 'createdAt'>>): DonHang | undefined => {
		let updatedDonHang: DonHang | undefined;
		setDonHangs(
			donHangs.map((dh) => {
				if (dh.id === id) {
					updatedDonHang = { ...dh, ...updates };
					return updatedDonHang;
				}
				return dh;
			}),
		);
		return updatedDonHang;
	};

	const searchDonHang = (keyword: string): DonHang[] => {
		const lowerKeyword = keyword.toLowerCase();
		return donHangs.filter(
			(dh) => dh.id.toLowerCase().includes(lowerKeyword) || dh.customerName.toLowerCase().includes(lowerKeyword),
		);
	};

	const isDonHangIdExists = (id: string): boolean => {
		return donHangs.some((dh) => dh.id === id);
	};

	const canCancelOrder = (status: DonHangStatus): boolean => {
		return status === 'Chờ xác nhận';
	};

	return {
		donHangs,
		addDonHang,
		updateDonHang: updateDonHangData,
		updateDonHangStatus,
		getDonHangById,
		deleteDonHang,
		getDonHangsByStatus,
		getCompletedOrdersRevenue,
		searchDonHang,
		isDonHangIdExists,
		canCancelOrder,
	};
};
