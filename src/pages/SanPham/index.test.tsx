import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SanPhamPage from './index';

// Mock Ant Design message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
  },
}));

describe('SanPhamPage', () => {
  test('render danh sách sản phẩm', () => {
    render(<SanPhamPage />);
    
    // Check title
    expect(screen.getByText('Quản lý Sản phẩm')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Thêm sản phẩm')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tìm kiếm theo tên sản phẩm/i)).toBeInTheDocument();
  });

  test('hiển thị danh sách sản phẩm mặc định', () => {
    render(<SanPhamPage />);
    
    // Check các sản phẩm mặc định
    expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
  });

  test('tìm kiếm sản phẩm', async () => {
    render(<SanPhamPage />);
    
    const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên sản phẩm/i);
    
    // Search for laptop
    fireEvent.change(searchInput, { target: { value: 'Laptop' } });
    
    // Check filtered results
    expect(screen.getByText('Laptop Dell XPS 13')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 15 Pro Max')).not.toBeInTheDocument();
  });

  test('tìm kiếm không phân biệt hoa thường', async () => {
    render(<SanPhamPage />);
    
    const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên sản phẩm/i);
    
    // Search with lowercase
    fireEvent.change(searchInput, { target: { value: 'iphone' } });
    
    // Should still find the product
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
  });

  test('mở Modal thêm sản phẩm', async () => {
    render(<SanPhamPage />);
    
    const addButton = screen.getByText('Thêm sản phẩm');
    fireEvent.click(addButton);
    
    // Check modal title
    await waitFor(() => {
      expect(screen.getByText('Thêm Sản phẩm')).toBeInTheDocument();
    });
  });

  test('search case-insensitive', () => {
    render(<SanPhamPage />);
    
    const searchInput = screen.getByPlaceholderText(/Tìm kiếm theo tên sản phẩm/i);
    
    // Search Samsung with uppercase
    fireEvent.change(searchInput, { target: { value: 'SAMSUNG' } });
    expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
  });
});
