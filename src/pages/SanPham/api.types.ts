/**
 * API Documentation - Quản lý Sản phẩm
 * 
 * Trong phiên bản hiện tại, dữ liệu được quản lý bằng React State.
 * Để tích hợp với backend API thực, có thể sử dụng các interface này.
 */

/**
 * Định nghĩa interface cho Sản phẩm
 */
export interface SanPham {
  /** ID duy nhất của sản phẩm */
  id: number;
  /** Tên sản phẩm */
  name: string;
  /** Giá sản phẩm (VND) */
  price: number;
  /** Số lượng tồn kho */
  quantity: number;
}

/**
 * Request body cho việc tạo sản phẩm mới
 */
export interface CreateSanPhamRequest {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Request body cho việc cập nhật sản phẩm
 */
export interface UpdateSanPhamRequest {
  name?: string;
  price?: number;
  quantity?: number;
}

/**
 * Response API cho danh sách sản phẩm
 */
export interface GetSanPhamsResponse {
  success: boolean;
  data: SanPham[];
  message?: string;
  total?: number;
}

/**
 * Response API cho một sản phẩm
 */
export interface GetSanPhamResponse {
  success: boolean;
  data: SanPham;
  message?: string;
}

/**
 * Response API cho thao tác tạo/cập nhật/xóa
 */
export interface ActionResponse {
  success: boolean;
  message: string;
  data?: SanPham | null;
}

/**
 * Danh sách các endpoint có thể được cài đặt
 * 
 * GET    /api/san-pham              - Lấy danh sách tất cả sản phẩm
 * GET    /api/san-pham/:id          - Lấy chi tiết 1 sản phẩm
 * POST   /api/san-pham              - Tạo sản phẩm mới
 * PUT    /api/san-pham/:id          - Cập nhật sản phẩm
 * DELETE /api/san-pham/:id          - Xóa sản phẩm
 * GET    /api/san-pham/search       - Tìm kiếm sản phẩm
 */

/**
 * Ví dụ integration với API backend:
 * 
 * // Tạo service API
 * import axios from 'axios';
 * 
 * const API_BASE_URL = 'http://localhost:3001/api';
 * 
 * export const sanPhamService = {
 *   // Lấy danh sách sản phẩm
 *   getAll: async () => {
 *     const response = await axios.get(`${API_BASE_URL}/san-pham`);
 *     return response.data;
 *   },
 * 
 *   // Lấy chi tiết sản phẩm
 *   getById: async (id: number) => {
 *     const response = await axios.get(`${API_BASE_URL}/san-pham/${id}`);
 *     return response.data;
 *   },
 * 
 *   // Tạo sản phẩm mới
 *   create: async (data: CreateSanPhamRequest) => {
 *     const response = await axios.post(`${API_BASE_URL}/san-pham`, data);
 *     return response.data;
 *   },
 * 
 *   // Cập nhật sản phẩm
 *   update: async (id: number, data: UpdateSanPhamRequest) => {
 *     const response = await axios.put(`${API_BASE_URL}/san-pham/${id}`, data);
 *     return response.data;
 *   },
 * 
 *   // Xóa sản phẩm
 *   delete: async (id: number) => {
 *     const response = await axios.delete(`${API_BASE_URL}/san-pham/${id}`);
 *     return response.data;
 *   },
 * 
 *   // Tìm kiếm sản phẩm
 *   search: async (keyword: string) => {
 *     const response = await axios.get(`${API_BASE_URL}/san-pham/search`, {
 *       params: { q: keyword }
 *     });
 *     return response.data;
 *   }
 * };
 */
