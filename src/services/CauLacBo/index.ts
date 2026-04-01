import { request } from 'umi';
import type { CauLacBo, DonDangKyThanhVien, LichSuThaoTac } from '@/models/caulacbo';

// Mock data storage for development when backend not ready
let mockCauLacBos: CauLacBo[] = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
let mockDonDangKy: DonDangKyThanhVien[] = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
let mockLichSu: LichSuThaoTac[] = JSON.parse(localStorage.getItem('mock_lichsu') || '[]');

const saveMockData = () => {
  localStorage.setItem('mock_caulacbos', JSON.stringify(mockCauLacBos));
  localStorage.setItem('mock_dongangky', JSON.stringify(mockDonDangKy));
  localStorage.setItem('mock_lichsu', JSON.stringify(mockLichSu));
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('donDangKy:changed'));
    }
  } catch (e) {
    // ignore
  }
};

// Initialize sample data if empty
const initSampleData = () => {
  if (mockCauLacBos.length === 0) {
    mockCauLacBos = [
      {
        id: 'clb_1',
        tenCauLacBo: 'Câu lạc bộ Lập trình Web',
        anhDaiDien: 'https://via.placeholder.com/150?text=Web+Coding',
        ngayThanhLap: '2025-01-15',
        moTa: '<p><strong>Câu lạc bộ chuyên về lập trình web</strong> với các dự án thực tế. Học tập HTML, CSS, JavaScript, React, Node.js</p>',
        chuNhiemCLB: 'Nguyễn Văn A',
        hoatDong: true,
        trangThai: 'active',
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
      {
        id: 'clb_2',
        tenCauLacBo: 'Câu lạc bộ Thể thao',
        anhDaiDien: 'https://via.placeholder.com/150?text=Sports',
        ngayThanhLap: '2024-09-20',
        moTa: '<p><strong>Câu lạc bộ thể thao đa dạng</strong>: Bóng đá, bóng chuyền, cầu lông, bóng rổ</p>',
        chuNhiemCLB: 'Phạm Thị B',
        hoatDong: true,
        trangThai: 'active',
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
      {
        id: 'clb_3',
        tenCauLacBo: 'Câu lạc bộ Âm nhạc',
        anhDaiDien: 'https://via.placeholder.com/150?text=Music',
        ngayThanhLap: '2024-11-10',
        moTa: '<p><strong>Câu lạc bộ âm nhạc</strong> dành cho các bạn yêu thích nhạc. Học guitar, piano, thanh nhạc</p>',
        chuNhiemCLB: 'Trần Văn C',
        hoatDong: true,
        trangThai: 'active',
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
      {
        id: 'clb_4',
        tenCauLacBo: 'Câu lạc bộ Tiếng Anh',
        anhDaiDien: 'https://via.placeholder.com/150?text=English',
        ngayThanhLap: '2025-02-01',
        moTa: '<p><strong>Rèn luyện kỹ năng tiếng Anh</strong> qua các hoạt động giao lưu, hội thoại, và các cuộc thi</p>',
        chuNhiemCLB: 'Lê Thị D',
        hoatDong: true,
        trangThai: 'active',
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
      {
        id: 'clb_5',
        tenCauLacBo: 'Câu lạc bộ Khoa học',
        anhDaiDien: 'https://via.placeholder.com/150?text=Science',
        ngayThanhLap: '2024-08-05',
        moTa: '<p><strong>Khám phá khoa học</strong> và công nghệ qua các thí nghiệm, seminar, và các dự án nghiên cứu</p>',
        chuNhiemCLB: 'Hoàng Văn E',
        hoatDong: false,
        trangThai: 'inactive',
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
      },
    ];
    saveMockData();
  }

  // Initialize sample registration data
  if (mockDonDangKy.length === 0) {
    mockDonDangKy = [
      {
        id: 'ddky_1',
        hoTen: 'Trần Minh Tuấn',
        email: 'tuan@email.com',
        soDienThoai: '0981234567',
        gioiTinh: 'nam',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Nguyễn Trãi',
        caulacboId: 'clb_1',
        lyDoDangKy: 'Muốn học lập trình web và phát triển kỹ năng IT',
        trangThai: 'approved',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-15').toISOString(),
        ngayCapNhat: new Date('2025-03-15').toISOString(),
      },
      {
        id: 'ddky_2',
        hoTen: 'Nguyễn Thị Linh',
        email: 'linh@email.com',
        soDienThoai: '0982345678',
        gioiTinh: 'nu',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Nam Thăng Long',
        caulacboId: 'clb_1',
        lyDoDangKy: 'Yêu thích lập trình, muốn cập nhật công nghệ mới',
        trangThai: 'pending',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-18').toISOString(),
        ngayCapNhat: new Date('2025-03-18').toISOString(),
      },
      {
        id: 'ddky_3',
        hoTen: 'Phạm Quốc Hùng',
        email: 'hung@email.com',
        soDienThoai: '0983456789',
        gioiTinh: 'nam',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Phan Bội Châu',
        caulacboId: 'clb_2',
        lyDoDangKy: 'Đam mê thể thao, muốn rèn luyện sức khỏe',
        trangThai: 'approved',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-10').toISOString(),
        ngayCapNhat: new Date('2025-03-10').toISOString(),
      },
      {
        id: 'ddky_4',
        hoTen: 'Lê Hoàng Anh',
        email: 'anh@email.com',
        soDienThoai: '0984567890',
        gioiTinh: 'nam',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Lương Văn Can',
        caulacboId: 'clb_2',
        lyDoDangKy: 'Yêu thích bóng đá',
        trangThai: 'pending',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-19').toISOString(),
        ngayCapNhat: new Date('2025-03-19').toISOString(),
      },
      {
        id: 'ddky_5',
        hoTen: 'Vũ Thị Hương',
        email: 'huong@email.com',
        soDienThoai: '0985678901',
        gioiTinh: 'nu',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Trần Phú',
        caulacboId: 'clb_3',
        lyDoDangKy: 'Đam mê âm nhạc, muốn học guitar',
        trangThai: 'approved',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-12').toISOString(),
        ngayCapNhat: new Date('2025-03-12').toISOString(),
      },
      {
        id: 'ddky_6',
        hoTen: 'Đỗ Văn Khánh',
        email: 'khanh@email.com',
        soDienThoai: '0986789012',
        gioiTinh: 'nam',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Hoàng Hoa Thám',
        caulacboId: 'clb_4',
        lyDoDangKy: 'Muốn cải thiện tiếng Anh',
        trangThai: 'rejected',
        ghiChu: 'Giới hạn thành viên câu lạc bộ',
        ngayDangKy: new Date('2025-03-08').toISOString(),
        ngayCapNhat: new Date('2025-03-09').toISOString(),
      },
      {
        id: 'ddky_7',
        hoTen: 'Triệu Minh Hiếu',
        email: 'hieu@email.com',
        soDienThoai: '0987890123',
        gioiTinh: 'nam',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Chu Văn An',
        caulacboId: 'clb_1',
        lyDoDangKy: 'Muốn phát triển sự nghiệp IT',
        trangThai: 'pending',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-20').toISOString(),
        ngayCapNhat: new Date('2025-03-20').toISOString(),
      },
      {
        id: 'ddky_8',
        hoTen: 'Kiều Thị Diễm',
        email: 'diem@email.com',
        soDienThoai: '0988901234',
        gioiTinh: 'nu',
        diaChi: 'Hà Nội',
        soTruong: 'THPT Quang Trung',
        caulacboId: 'clb_3',
        lyDoDangKy: 'Yêu thích ca hát',
        trangThai: 'approved',
        ghiChu: '',
        ngayDangKy: new Date('2025-03-14').toISOString(),
        ngayCapNhat: new Date('2025-03-14').toISOString(),
      },
    ];
    saveMockData();
  }
};

// Run initialization
initSampleData();

// ========== Câu lạc bộ ==========
export async function getCauLacBoList() {
  try {
    return await request('/api/caulacbo/list', {
      method: 'GET',
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    // Reload từ localStorage để lấy dữ liệu mới nhất
    mockCauLacBos = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
    console.log('Reloaded mock data from localStorage:', mockCauLacBos);
    return { data: mockCauLacBos };
  }
}

export async function getCauLacBoById(id: string) {
  try {
    return await request(`/api/caulacbo/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    const found = mockCauLacBos.find((c) => c.id === id);
    return { data: found || null };
  }
}

export async function addCauLacBo(data: Partial<CauLacBo>) {
  try {
    // TODO: Kích hoạt lại API khi backend sẵn sàng
    throw new Error('Backend not ready yet - using mock data');
    
    return await request('/api/caulacbo', {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.warn('API failed, creating mock data:', error);
    const newItem: CauLacBo = {
      id: `clb_${Date.now()}`,
      tenCauLacBo: data.tenCauLacBo || '',
      anhDaiDien: data.anhDaiDien || '',
      ngayThanhLap: data.ngayThanhLap || new Date().toISOString(),
      moTa: data.moTa || '',
      chuNhiemCLB: data.chuNhiemCLB || '',
      hoatDong: data.hoatDong || false,
      trangThai: data.trangThai || 'active',
      ngayTao: new Date().toISOString(),
      ngayCapNhat: new Date().toISOString(),
    };
    mockCauLacBos.push(newItem);
    console.log('Added to mock data, total items:', mockCauLacBos.length);
    console.log('New item:', newItem);
    saveMockData();
    console.log('Saved to localStorage');
    return { data: newItem };
  }
}

export async function updateCauLacBo(id: string, data: Partial<CauLacBo>) {
  try {
    // TODO: Kích hoạt lại API khi backend sẵn sàng
    throw new Error('Backend not ready yet - using mock data');
    
    return await request(`/api/caulacbo/${id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    console.warn('API failed, updating mock data:', error);
    mockCauLacBos = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
    const index = mockCauLacBos.findIndex((c) => c.id === id);
    if (index > -1) {
      mockCauLacBos[index] = {
        ...mockCauLacBos[index],
        ...data,
        ngayCapNhat: new Date().toISOString(),
      };
      console.log('Updated item:', mockCauLacBos[index]);
      saveMockData();
      console.log('Saved to localStorage');
      return { data: mockCauLacBos[index] };
    }
    return { data: null };
  }
}

export async function deleteCauLacBo(id: string) {
  try {
    // TODO: Kích hoạt lại API khi backend sẵn sàng
    throw new Error('Backend not ready yet - using mock data');
    
    return await request(`/api/caulacbo/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('API failed, deleting mock data:', error);
    mockCauLacBos = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
    const initialLength = mockCauLacBos.length;
    mockCauLacBos = mockCauLacBos.filter((c) => c.id !== id);
    console.log(`Deleted item, total items: ${initialLength} -> ${mockCauLacBos.length}`);
    saveMockData();
    console.log('Saved to localStorage');
    return { data: { id } };
  }
}

// ========== Đơn đăng ký thành viên ==========
export async function getDonDangKyList(params?: any) {
  try {
    return await request('/api/caulacbo/dongangky', {
      method: 'GET',
      params,
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    // Reload từ localStorage để lấy dữ liệu mới nhất
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    console.log('Reloaded mock data from localStorage:', mockDonDangKy);
    return { data: mockDonDangKy };
  }
}

export async function getDonDangKyById(id: string) {
  try {
    return await request(`/api/caulacbo/dongangky/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const found = mockDonDangKy.find((d) => d.id === id);
    return { data: found || null };
  }
}

export async function getDonDangKyByCauLacBo(caulacboId: string) {
  try {
    return await request('/api/caulacbo/dongangky', {
      method: 'GET',
      params: { caulacboId },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const filtered = mockDonDangKy.filter((d) => d.caulacboId === caulacboId);
    return { data: filtered };
  }
}

export async function addDonDangKy(data: Partial<DonDangKyThanhVien>) {
  try {
    return await request('/api/caulacbo/dongangky', {
      method: 'POST',
      data,
    });
  } catch (error) {
    console.warn('API failed, creating mock data:', error);
    const newItem: DonDangKyThanhVien = {
      id: `ddky_${Date.now()}`,
      hoTen: data.hoTen || '',
      email: data.email || '',
      soDienThoai: data.soDienThoai || '',
      gioiTinh: data.gioiTinh || 'nam',
      diaChi: data.diaChi || '',
      soTruong: data.soTruong || '',
      caulacboId: data.caulacboId || '',
      lyDoDangKy: data.lyDoDangKy || '',
      trangThai: data.trangThai || 'pending',
      ghiChu: data.ghiChu || '',
      ngayDangKy: new Date().toISOString(),
      ngayCapNhat: new Date().toISOString(),
    };
    mockDonDangKy.push(newItem);
    saveMockData();
    return { data: newItem };
  }
}

export async function updateDonDangKy(id: string, data: Partial<DonDangKyThanhVien>) {
  try {
    return await request(`/api/caulacbo/dongangky/${id}`, {
      method: 'PUT',
      data,
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const index = mockDonDangKy.findIndex((d) => d.id === id);
    if (index > -1) {
      mockDonDangKy[index] = {
        ...mockDonDangKy[index],
        ...data,
        ngayCapNhat: new Date().toISOString(),
      };
      saveMockData();
      return { data: mockDonDangKy[index] };
    }
    return { data: null };
  }
}

export async function deleteDonDangKy(id: string) {
  try {
    return await request(`/api/caulacbo/dongangky/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    mockDonDangKy = mockDonDangKy.filter((d) => d.id !== id);
    saveMockData();
    return { data: { id } };
  }
}

export async function approveDonDangKy(id: string, lyDo?: string) {
  try {
    return await request(`/api/caulacbo/dongangky/${id}/approve`, {
      method: 'PATCH',
      data: { lyDo },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const index = mockDonDangKy.findIndex((d) => d.id === id);
    if (index > -1) {
      mockDonDangKy[index].trangThai = 'approved';
      mockDonDangKy[index].ngayCapNhat = new Date().toISOString();
      saveMockData();
    }
    return { data: null };
  }
}

export async function rejectDonDangKy(id: string, lyDo: string) {
  try {
    return await request(`/api/caulacbo/dongangky/${id}/reject`, {
      method: 'PATCH',
      data: { lyDo },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const index = mockDonDangKy.findIndex((d) => d.id === id);
    if (index > -1) {
      mockDonDangKy[index].trangThai = 'rejected';
      mockDonDangKy[index].ghiChu = lyDo;
      mockDonDangKy[index].ngayCapNhat = new Date().toISOString();
      saveMockData();
    }
    return { data: null };
  }
}

export async function approveMultipleDonDangKy(ids: string[]) {
  try {
    return await request('/api/caulacbo/dongangky/approve-multiple', {
      method: 'PATCH',
      data: { ids },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    ids.forEach((id) => {
      const index = mockDonDangKy.findIndex((d) => d.id === id);
      if (index > -1) {
        mockDonDangKy[index].trangThai = 'approved';
        mockDonDangKy[index].ngayCapNhat = new Date().toISOString();
      }
    });
    saveMockData();
    return { data: null };
  }
}

export async function rejectMultipleDonDangKy(ids: string[], lyDo: string) {
  try {
    return await request('/api/caulacbo/dongangky/reject-multiple', {
      method: 'PATCH',
      data: { ids, lyDo },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    ids.forEach((id) => {
      const index = mockDonDangKy.findIndex((d) => d.id === id);
      if (index > -1) {
        mockDonDangKy[index].trangThai = 'rejected';
        mockDonDangKy[index].ghiChu = lyDo;
        mockDonDangKy[index].ngayCapNhat = new Date().toISOString();
      }
    });
    saveMockData();
    return { data: null };
  }
}

// ========== Lịch sử thao tác ==========
export async function getLichSuThaoTacByDonDangKy(donDangKyId: string) {
  try {
    return await request('/api/caulacbo/lichsu', {
      method: 'GET',
      params: { donDangKyId },
    });
  } catch (error) {
    mockLichSu = JSON.parse(localStorage.getItem('mock_lichsu') || '[]');
    const filtered = mockLichSu.filter((ls) => ls.donDangKyId === donDangKyId);
    return { data: filtered };
  }
}

export async function addLichSuThaoTac(data: Partial<LichSuThaoTac>) {
  try {
    return await request('/api/caulacbo/lichsu', {
      method: 'POST',
      data,
    });
  } catch (error) {
    const newItem: LichSuThaoTac = {
      id: `ls_${Date.now()}`,
      donDangKyId: data.donDangKyId || '',
      hanhDong: data.hanhDong || 'approved',
      nguoiThaoTac: data.nguoiThaoTac || 'Admin',
      thoiDiem: new Date().toISOString(),
      lyDo: data.lyDo || '',
      ghiChu: data.ghiChu || '',
    };
    mockLichSu.push(newItem);
    saveMockData();
    return { data: newItem };
  }
}

// ========== Thống kê ==========
export async function getThongKeTongQuanData() {
  try {
    return await request('/api/caulacbo/thongke/tongquan', {
      method: 'GET',
    });
  } catch (error) {
    mockCauLacBos = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const pendingCount = mockDonDangKy.filter((d) => d.trangThai === 'pending').length;
    const approvedCount = mockDonDangKy.filter((d) => d.trangThai === 'approved').length;
    const rejectedCount = mockDonDangKy.filter((d) => d.trangThai === 'rejected').length;
    return {
      data: {
        numberOfClubs: mockCauLacBos.length,
        totalApplications: mockDonDangKy.length,
        pendingCount,
        approvedCount,
        rejectedCount,
      },
    };
  }
}

export async function getThongKeTheoCauLacBo() {
  try {
    return await request('/api/caulacbo/thongke/thecaulacbo', {
      method: 'GET',
    });
  } catch (error) {
    mockCauLacBos = JSON.parse(localStorage.getItem('mock_caulacbos') || '[]');
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const stats = mockCauLacBos.map((clb) => ({
      caulacboId: clb.id,
      pending: mockDonDangKy.filter((d) => d.caulacboId === clb.id && d.trangThai === 'pending').length,
      approved: mockDonDangKy.filter((d) => d.caulacboId === clb.id && d.trangThai === 'approved').length,
      rejected: mockDonDangKy.filter((d) => d.caulacboId === clb.id && d.trangThai === 'rejected').length,
    }));
    return { data: stats };
  }
}

// ========== Thành viên (Approved) ==========
export async function getThanhVienByCauLacBo(caulacboId: string) {
  try {
    return await request(`/api/caulacbo/thanhvien/${caulacboId}`, {
      method: 'GET',
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    const members = mockDonDangKy.filter((d) => d.caulacboId === caulacboId && d.trangThai === 'approved');
    return { data: members };
  }
}

export async function changeThanhVienCauLacBo(ids: string[], caulacboIdSau: string) {
  try {
    return await request('/api/caulacbo/thanhvien/change-club', {
      method: 'PATCH',
      data: { ids, caulacboIdSau },
    });
  } catch (error) {
    mockDonDangKy = JSON.parse(localStorage.getItem('mock_dongangky') || '[]');
    ids.forEach((id) => {
      const index = mockDonDangKy.findIndex((d) => d.id === id);
      if (index > -1) {
        mockDonDangKy[index].caulacboId = caulacboIdSau;
        mockDonDangKy[index].ngayCapNhat = new Date().toISOString();
      }
    });
    saveMockData();
    return { data: null };
  }
}
