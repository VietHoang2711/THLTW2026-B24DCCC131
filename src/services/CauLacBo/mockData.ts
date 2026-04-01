import React, { useState } from 'react';
import axios from '@/utils/axios';

/**
 * Mock Data for Development/Testing
 * Remove or replace with real API calls when backend is ready
 */

export const MOCK_CAU_LAC_BO = [
  {
    id: 'clb001',
    tenCauLacBo: 'Câu lạc bộ Lập trình',
    anhDaiDien: 'https://via.placeholder.com/300?text=CLB+Lap+trinh',
    ngayThanhLap: '2023-01-15',
    moTa: '<p>Câu lạc bộ dành cho những enthusiast về lập trình</p>',
    chuNhiemCLB: 'Nguyễn Văn A',
    hoatDong: true,
    trangThai: 'active' as const,
    ngayTao: new Date().toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'clb002',
    tenCauLacBo: 'Câu lạc bộ Thiết kế',
    anhDaiDien: 'https://via.placeholder.com/300?text=CLB+Thiet+ke',
    ngayThanhLap: '2023-02-20',
    moTa: '<p>Câu lạc bộ về thiết kế đồ họa và UX/UI</p>',
    chuNhiemCLB: 'Trần Thị B',
    hoatDong: true,
    trangThai: 'active' as const,
    ngayTao: new Date().toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
];

export const MOCK_DON_DANG_KY = [
  {
    id: 'ddky001',
    hoTen: 'Trần Văn C',
    email: 'tran.van.c@example.com',
    soDienThoai: '0901234567',
    gioiTinh: 'nam' as const,
    diaChi: 'Hà Nội',
    soTruong: 'Lập trình C++',
    caulacboId: 'clb001',
    lyDoDangKy: 'Muốn nâng cao kỹ năng lập trình',
    trangThai: 'pending' as const,
    ghiChu: '',
    ngayDangKy: new Date().toISOString(),
    ngayCapNhat: new Date().toISOString(),
  },
  {
    id: 'ddky002',
    hoTen: 'Phạm Thị D',
    email: 'pham.thi.d@example.com',
    soDienThoai: '0912345678',
    gioiTinh: 'nu' as const,
    diaChi: 'Hà Nội',
    soTruong: 'Thiết kế UI',
    caulacboId: 'clb002',
    lyDoDangKy: 'Tìm hiểu về thiết kế',
    trangThai: 'approved' as const,
    ghiChu: '',
    ngayDangKy: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ngayCapNhat: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Local Storage Service for Development
 * In production, replace with actual API calls
 */
class LocalStorageCauLacBoService {
  private caulacboKey = 'caulacbo_list';
  private dongangkyKey = 'dongangky_list';
  private lichsuKey = 'lichsu_list';

  // Initialize with mock data if empty
  private initMockData() {
    if (!localStorage.getItem(this.caulacboKey)) {
      localStorage.setItem(this.caulacboKey, JSON.stringify(MOCK_CAU_LAC_BO));
    }
    if (!localStorage.getItem(this.dongangkyKey)) {
      localStorage.setItem(this.dongangkyKey, JSON.stringify(MOCK_DON_DANG_KY));
    }
  }

  getCauLacBoList() {
    this.initMockData();
    return JSON.parse(localStorage.getItem(this.caulacboKey) || '[]');
  }

  getDonDangKyList() {
    this.initMockData();
    return JSON.parse(localStorage.getItem(this.dongangkyKey) || '[]');
  }

  getLichSuList() {
    return JSON.parse(localStorage.getItem(this.lichsuKey) || '[]');
  }

  // Save methods...
}

export const localStorageService = new LocalStorageCauLacBoService();
