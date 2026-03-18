import { request } from 'umi';

// Các API endpoints cho Nhân viên
export async function getNhanVienList() {
  return request('/api/dichvu/nhanvien', {
    method: 'GET',
  });
}

export async function addNhanVien(data: any) {
  return request('/api/dichvu/nhanvien', {
    method: 'POST',
    data,
  });
}

export async function updateNhanVien(id: string, data: any) {
  return request(`/api/dichvu/nhanvien/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteNhanVien(id: string) {
  return request(`/api/dichvu/nhanvien/${id}`, {
    method: 'DELETE',
  });
}

// Các API endpoints cho Dịch vụ
export async function getDichVuList() {
  return request('/api/dichvu/dichvu', {
    method: 'GET',
  });
}

export async function addDichVu(data: any) {
  return request('/api/dichvu/dichvu', {
    method: 'POST',
    data,
  });
}

export async function updateDichVu(id: string, data: any) {
  return request(`/api/dichvu/dichvu/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDichVu(id: string) {
  return request(`/api/dichvu/dichvu/${id}`, {
    method: 'DELETE',
  });
}

// Các API endpoints cho Lịch hẹn
export async function getLichHenList() {
  return request('/api/dichvu/lichhen', {
    method: 'GET',
  });
}

export async function getLichHenByMonth(year: number, month: number) {
  return request('/api/dichvu/lichhen', {
    method: 'GET',
    params: { year, month },
  });
}

export async function addLichHen(data: any) {
  return request('/api/dichvu/lichhen', {
    method: 'POST',
    data,
  });
}

export async function updateLichHenStatus(id: string, status: string) {
  return request(`/api/dichvu/lichhen/${id}/status`, {
    method: 'PATCH',
    data: { status },
  });
}

export async function cancelLichHen(id: string, reason: string) {
  return request(`/api/dichvu/lichhen/${id}/cancel`, {
    method: 'PATCH',
    data: { reason },
  });
}

// Các API endpoints cho Đánh giá
export async function getDanhGiaList() {
  return request('/api/dichvu/danhgia', {
    method: 'GET',
  });
}

export async function getDanhGiaByNhanVien(nhanVienId: string) {
  return request('/api/dichvu/danhgia', {
    method: 'GET',
    params: { nhanVienId },
  });
}

export async function addDanhGia(data: any) {
  return request('/api/dichvu/danhgia', {
    method: 'POST',
    data,
  });
}

export async function replyDanhGia(id: string, reply: string) {
  return request(`/api/dichvu/danhgia/${id}/reply`, {
    method: 'PATCH',
    data: { reply },
  });
}

// Các API endpoints cho Thống kê
export async function getThongKeDoanhThu(startDate: string, endDate: string) {
  return request('/api/dichvu/thongke/doanhthu', {
    method: 'GET',
    params: { startDate, endDate },
  });
}

export async function getThongKeDichVu(startDate: string, endDate: string) {
  return request('/api/dichvu/thongke/dichvu', {
    method: 'GET',
    params: { startDate, endDate },
  });
}

export async function getThongKeNhanVien(startDate: string, endDate: string) {
  return request('/api/dichvu/thongke/nhanvien', {
    method: 'GET',
    params: { startDate, endDate },
  });
}

export async function getThongKeLichHen(startDate: string, endDate: string) {
  return request('/api/dichvu/thongke/lichhen', {
    method: 'GET',
    params: { startDate, endDate },
  });
}
