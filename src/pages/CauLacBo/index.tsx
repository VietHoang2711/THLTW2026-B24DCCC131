import React, { useEffect, useState } from 'react';
import { Tabs, Card, message, Button, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DanhSachCauLacBo from './DanhSachCauLacBo';
import QuanLyDonDangKy from './QuanLyDonDangKy';
import QuanLyThanhVien from './QuanLyThanhVien';
import ThongKe from './ThongKe';
import ModalCauLacBo from './components/ModalCauLacBo';
import { getCauLacBoList } from '@/services/CauLacBo';
import type { CauLacBo } from '@/models/caulacbo';
import './index.less';

const { TabPane } = Tabs;

const CauLacBoPage: React.FC = () => {
  const [caulacbos, setCauLacBos] = useState<CauLacBo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModalCauLacBo, setShowModalCauLacBo] = useState(false);
  const [editingCauLacBo, setEditingCauLacBo] = useState<CauLacBo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load danh sách câu lạc bộ
  const loadCauLacBoList = async () => {
    setLoading(true);
    try {
      console.log('Loading Câu Lạc Bộ list...');
      const response = await getCauLacBoList();
      console.log('Loaded response:', response);
      const data = response?.data || [];
      console.log('Setting state with data:', data);
      setCauLacBos(data);
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCauLacBoList();
  }, []);

  // Listen to data changes from all tabs
  useEffect(() => {
    const handleDataChanged = () => {
      console.log('Data changed event received');
      loadCauLacBoList();
      // Increment key to force refresh all child components
      setRefreshKey((prev) => prev + 1);
    };

    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('donDangKy:changed', handleDataChanged);
      }
    } catch (e) {
      console.error('Error adding event listener:', e);
    }

    return () => {
      try {
        if (typeof window !== 'undefined' && window.removeEventListener) {
          window.removeEventListener('donDangKy:changed', handleDataChanged);
        }
      } catch (e) {
        console.error('Error removing event listener:', e);
      }
    };
  }, []);

  const handleOpenModalAdd = () => {
    setEditingCauLacBo(null);
    setShowModalCauLacBo(true);
  };

  const handleCloseModal = () => {
    setShowModalCauLacBo(false);
    setEditingCauLacBo(null);
  };

  const handleSaveCauLacBo = async (created?: CauLacBo | null) => {
    try {
      if (created) {
        // Nếu backend/mock trả về item vừa tạo/cập nhật thì cập nhật state luôn để không phụ thuộc vào API
        setCauLacBos((prev) => {
          // Nếu item đã tồn tại thì replace, ngược lại thêm mới vào đầu danh sách
          const idx = prev.findIndex((c) => c.id === created.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = created as CauLacBo;
            return next;
          }
          return [created as CauLacBo, ...prev];
        });
      } else {
        await loadCauLacBoList();
      }
      // Dispatch event to refresh other components
      window.dispatchEvent(new Event('donDangKy:changed'));
    } catch (err) {
      console.error('Error in handleSaveCauLacBo:', err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Card className="caulacbo-page">
      <Tabs defaultActiveKey="1">
        {/* Tab 1: Danh sách câu lạc bộ */}
        <TabPane
          tab={
            <Space>
              <span>Danh sách Câu lạc bộ</span>
            </Space>
          }
          key="1"
        >
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModalAdd}
            >
              Thêm Câu lạc bộ
            </Button>
          </div>
          <DanhSachCauLacBo
            data={caulacbos}
            loading={loading}
            onReload={loadCauLacBoList}
            onEdit={(record) => {
              setEditingCauLacBo(record);
              setShowModalCauLacBo(true);
            }}
          />
        </TabPane>

        {/* Tab 2: Quản lý đơn đăng ký */}
        <TabPane tab="Quản lý Đơn đăng ký" key="2">
          <QuanLyDonDangKy caulacbos={caulacbos} />
        </TabPane>

        {/* Tab 3: Quản lý thành viên */}
        <TabPane tab="Quản lý Thành viên" key="3">
          <QuanLyThanhVien caulacbos={caulacbos} />
        </TabPane>

        {/* Tab 4: Báo cáo thống kê */}
        <TabPane tab="Báo cáo & Thống kê" key="4">
          <ThongKe caulacbos={caulacbos} />
        </TabPane>
      </Tabs>

      {/* Modal thêm/sửa câu lạc bộ */}
      <ModalCauLacBo
        visible={showModalCauLacBo}
        onCancel={handleCloseModal}
        onSave={handleSaveCauLacBo}
        initialValues={editingCauLacBo}
      />
    </Card>
  );
};

export default CauLacBoPage;
