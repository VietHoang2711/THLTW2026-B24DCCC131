import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { deleteCauLacBo } from '@/services/CauLacBo';
import type { CauLacBo } from '@/models/caulacbo';
import ModalViewMembers from './components/ModalViewMembers';

interface DanhSachCauLacBoProps {
  data: CauLacBo[];
  loading: boolean;
  onReload: () => void;
  onEdit: (record: CauLacBo) => void;
}

const DanhSachCauLacBo: React.FC<DanhSachCauLacBoProps> = ({ data, loading, onReload, onEdit }) => {
  const [searchText, setSearchText] = useState('');
  const [filterCauLacBoId, setFilterCauLacBoId] = useState<string | null>(null);
  const [showViewMembers, setShowViewMembers] = useState(false);

  // Listen to data changes from other tabs
  useEffect(() => {
    const handleDataChanged = () => {
      console.log('DanhSachCauLacBo: Data changed event received');
      onReload();
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
  }, [onReload]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCauLacBo(id);
      message.success('Xóa câu lạc bộ thành công');
      onReload();
    } catch (error) {
      message.error('Lỗi xóa câu lạc bộ');
    }
  };

  const filteredData = data.filter((item) =>
    item.tenCauLacBo.toLowerCase().includes(searchText.toLowerCase()) ||
    item.chuNhiemCLB.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'anhDaiDien',
      key: 'anhDaiDien',
      width: 80,
      render: (url: string) => (
        <div style={{ width: 60, height: 60, overflow: 'hidden', borderRadius: 4 }}>
          {url ? (
            <img src={url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ background: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Không ảnh
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tên Câu lạc bộ',
      dataIndex: 'tenCauLacBo',
      key: 'tenCauLacBo',
      width: 150,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'ngayThanhLap',
      key: 'ngayThanhLap',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'chuNhiemCLB',
      key: 'chuNhiemCLB',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: 200,
      render: (html: string) => (
        <div
          style={{
            maxHeight: 60,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'hoatDong',
      key: 'hoatDong',
      width: 100,
      render: (active: boolean) => (active ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: CauLacBo) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setFilterCauLacBoId(record.id);
              setShowViewMembers(true);
            }}
          >
            Thành viên
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa câu lạc bộ"
            description="Bạn chắc chắn muốn xóa câu lạc bộ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên câu lạc bộ hoặc chủ nhiệm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} câu lạc bộ`,
        }}
      />

      <ModalViewMembers
        visible={showViewMembers}
        onCancel={() => {
          setShowViewMembers(false);
          setFilterCauLacBoId(null);
        }}
        caulacboId={filterCauLacBoId}
      />
    </div>
  );
};

export default DanhSachCauLacBo;
