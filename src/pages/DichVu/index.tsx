import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  StarOutlined,
  BarChartOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import NhanVienPage from './NhanVien';
import DichVuPage from './DichVu/index';
import LichHenPage from './DatLichHen';
import DanhGiaPage from './DichVu/DanhGia';
import ThongKePage from './ThongKe';

import styles from './index.less';

const { Sider, Content } = Layout;

export default function DichVuComponent() {
  const [activeKey, setActiveKey] = useState<string>('dichvu');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const menuItems = [
    {
      key: 'dichvu',
      icon: <ShoppingOutlined />,
      label: 'Dịch vụ',
    },
    {
      key: 'nhanvien',
      icon: <UserOutlined />,
      label: 'Nhân viên',
    },
    {
      key: 'lichhen',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn',
    },
    {
      key: 'danhgia',
      icon: <StarOutlined />,
      label: 'Đánh giá',
    },
    {
      key: 'thongke',
      icon: <BarChartOutlined />,
      label: 'Thống kê',
    },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'nhanvien':
        return <NhanVienPage key={refreshKey} />;
      case 'dichvu':
        return <DichVuPage key={refreshKey} />;
      case 'lichhen':
        return <LichHenPage key={refreshKey} />;
      case 'danhgia':
        return <DanhGiaPage key={refreshKey} />;
      case 'thongke':
        return <ThongKePage key={refreshKey} />;
      default:
        return <DichVuPage key={refreshKey} />;
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className={styles.sidebar} style={{ overflow: 'auto', height: '100vh' }}>
        <div className={styles.logo}>
          <h2>Dịch Vụ</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={(e) => setActiveKey(e.key)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <div className={styles.header}>
            <h1>{menuItems.find((m) => m.key === activeKey)?.label}</h1>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Làm mới
            </Button>
          </div>
          <div className={styles.body}>{renderContent()}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
