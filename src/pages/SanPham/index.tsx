import React, { useState, useMemo } from 'react';
import { Button, Input, Popconfirm, Space, Table, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSanPhamModel, SanPham } from '@/models/sanpham';
import { AddSanPhamModal } from './AddSanPhamModal';
import styles from './index.less';

const SanPhamPage: React.FC = () => {
  const { sanPhams, addSanPham, deleteSanPham } = useSanPhamModel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter products based on search text
  const filteredSanPhams = useMemo(() => {
    if (!searchText.trim()) {
      return sanPhams;
    }
    return sanPhams.filter((sp) =>
      sp.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [sanPhams, searchText]);

  const handleAddSanPham = (values: Omit<SanPham, 'id'>) => {
    setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      addSanPham(values);
      setIsModalVisible(false);
      message.success('Thêm sản phẩm thành công!');
      setLoading(false);
    }, 500);
  };

  const handleDeleteSanPham = (id: number, name: string) => {
    deleteSanPham(id);
    message.success(`Xóa sản phẩm "${name}" thành công!`);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <span className={styles.price}>
          {price.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number) => (
        <span className={styles.quantity}>{quantity}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: SanPham) => (
        <Space>
          <Popconfirm
            title={`Bạn có chắc muốn xóa sản phẩm "${record.name}"?`}
            onConfirm={() => handleDeleteSanPham(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý Sản phẩm</h1>
        <Space className={styles.toolbar}>
          <Input.Search
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => setSearchText(value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Thêm sản phẩm
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSanPhams}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
          position: ['bottomCenter'],
        }}
        locale={{
          emptyText: 'Không có sản phẩm nào',
        }}
      />

      <AddSanPhamModal
        visible={isModalVisible}
        onOk={handleAddSanPham}
        onCancel={() => setIsModalVisible(false)}
        loading={loading}
      />
    </div>
  );
};

export default SanPhamPage;
