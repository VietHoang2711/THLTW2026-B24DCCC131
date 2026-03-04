import React, { useState } from 'react';
import { Tabs, Space, Button } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons';
import SanPhamPage from '../SanPham';
import DonHangPage from '../DonHang';
import DashboardPage from '../Dashboard';
import styles from './index.less';

type TabKey = 'dashboard' | 'sanpham' | 'donhang';

const QuanLyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const items = [
    {
      key: 'dashboard',
      label: (
        <span>
          <BarChartOutlined />
          Bảng điều khiển
        </span>
      ),
      children: <DashboardPage />,
    },
    {
      key: 'sanpham',
      label: (
        <span>
          <ShopOutlined />
          Quản lý sản phẩm
        </span>
      ),
      children: <SanPhamPage />,
    },
    {
      key: 'donhang',
      label: (
        <span>
          <ShoppingCartOutlined />
          Quản lý đơn hàng
        </span>
      ),
      children: <DonHangPage />,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hệ thống Quản lý Sản phẩm và Đơn hàng</h1>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        items={items}
        size="large"
        type="card"
        className={styles.tabs}
      />
    </div>
  );
};

export default QuanLyPage;
