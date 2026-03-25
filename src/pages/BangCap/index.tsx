import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  FileTextOutlined,
  FormOutlined,
  SearchOutlined,
  BarChartOutlined,
  SettingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import SoVanBangPage from './SoVanBang';
import QuyetDinhPage from './QuyetDinh';
import CauHinhBieuMauPage from './CauHinhBieuMau';
import ThongTinVanBangPage from './ThongTinVanBang';
import TraCuuVanBangPage from './TraCuuVanBang';

import styles from './index.less';

const { Sider, Content } = Layout;

export default function BangCapComponent() {
  const [activeKey, setActiveKey] = useState<string>('sovanbang');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const menuItems = [
    {
      key: 'sovanbang',
      icon: <FileTextOutlined />,
      label: 'Sổ Văn Bằng',
    },
    {
      key: 'quyetdinh',
      icon: <FormOutlined />,
      label: 'Quyết Định Tốt Nghiệp',
    },
    {
      key: 'cauhinhbieumap',
      icon: <SettingOutlined />,
      label: 'Cấu Hình Biểu Mẫu',
    },
    {
      key: 'thongtinvanbang',
      icon: <FileTextOutlined />,
      label: 'Thông Tin Văn Bằng',
    },
    {
      key: 'tracuu',
      icon: <SearchOutlined />,
      label: 'Tra Cứu Văn Bằng',
    },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'sovanbang':
        return <SoVanBangPage key={refreshKey} />;
      case 'quyetdinh':
        return <QuyetDinhPage key={refreshKey} />;
      case 'cauhinhbieumap':
        return <CauHinhBieuMauPage key={refreshKey} />;
      case 'thongtinvanbang':
        return <ThongTinVanBangPage key={refreshKey} />;
      case 'tracuu':
        return <TraCuuVanBangPage key={refreshKey} />;
      default:
        return <SoVanBangPage key={refreshKey} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className={styles.sider}>
        <div className={styles.logo}>Quản lý Văn Bằng</div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={(e) => setActiveKey(e.key)}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <div className={styles.header}>
            <h1>{menuItems.find((m) => m.key === activeKey)?.label}</h1>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => setRefreshKey(refreshKey + 1)}
              style={{ marginLeft: 'auto' }}
            >
              Làm mới
            </Button>
          </div>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
