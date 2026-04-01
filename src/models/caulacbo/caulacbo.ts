// Câu lạc bộ model
export interface CauLacBo {
  id: string;
  tenCauLacBo: string;
  anhDaiDien: string; // URL hình ảnh
  ngayThanhLap: string; // ISO date
  moTa: string; // HTML
  chuNhiemCLB: string;
  hoatDong: boolean; // Có/Không
  trangThai: 'active' | 'inactive';
  ngayTao: string;
  ngayCapNhat: string;
}

export interface DonDangKyThanhVien {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: 'nam' | 'nu' | 'khac';
  diaChi: string;
  soTruong: string;
  caulacboId: string; // ID câu lạc bộ
  lyDoDangKy: string;
  trangThai: 'pending' | 'approved' | 'rejected';
  ghiChu: string; // Lý do từ chối
  ngayDangKy: string;
  ngayCapNhat: string;
}

export interface LichSuThaoTac {
  id: string;
  donDangKyId: string;
  hanhDong: 'approved' | 'rejected'; // Hành động
  nguoiThaoTac: string; // Admin name
  thoiDiem: string; // ISO datetime
  lyDo: string; // Lý do (chỉ dùng khi rejected)
  ghiChu: string;
}

export interface UploadFile {
  originFileObj?: any;
  url?: string;
  fileList?: any[];
}

// Types for form
export type CauLacBoFormValues = Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>;
export type DonDangKyFormValues = Omit<DonDangKyThanhVien, 'id' | 'ngayDangKy' | 'ngayCapNhat'>;
