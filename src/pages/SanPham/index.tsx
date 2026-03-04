import React, { useState, useMemo, useCallback } from 'react';
import { Button, Input, Popconfirm, Space, Table, message, Tag, Select, Slider, Row, Col, Card } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useSanPhamModel, SanPham, SanPhamStatus } from '@/models/sanpham';
import { AddSanPhamModal } from './AddSanPhamModal';
import { EditSanPhamModal } from './EditSanPhamModal';
import styles from './index.less';

type SortType = 'name' | 'price-asc' | 'price-desc' | 'quantity' | null;

const SanPhamPage: React.FC = () => {
  const { sanPhams, addSanPham, deleteSanPham, updateSanPham, getSanPhamStatus } = useSanPhamModel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
  const [statusFilter, setStatusFilter] = useState<SanPhamStatus | undefined>();
  const [sortType, setSortType] = useState<SortType>(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(sanPhams.map(sp => sp.category)));
    return cats;
  }, [sanPhams]);

  // Filter and sort products
  const filteredSanPhams = useMemo(() => {
    let filtered = sanPhams.filter(sp => {
      const matchSearch = !searchText.trim() || sp.name.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = !selectedCategory || sp.category === selectedCategory;
      const matchPrice = sp.price >= priceRange[0] && sp.price <= priceRange[1];
      const matchStatus = !statusFilter || getSanPhamStatus(sp.quantity) === statusFilter;
      
      return matchSearch && matchCategory && matchPrice && matchStatus;
    });

    // Sorting
    if (sortType === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === 'quantity') {
      filtered = filtered.sort((a, b) => b.quantity - a.quantity);
    }

    return filtered;
  }, [sanPhams, searchText, selectedCategory, priceRange, statusFilter, sortType, getSanPhamStatus]);

  const handleAddSanPham = useCallback((values: Omit<SanPham, 'id'>) => {
    setLoading(true);
    setTimeout(() => {
      addSanPham(values);
      setIsModalVisible(false);
      message.success('Thêm sản phẩm thành công!');
      setLoading(false);
    }, 500);
  }, [addSanPham]);

  const handleEditSanPham = useCallback((values: Omit<SanPham, 'id'>) => {
    if (!editingProduct) return;
    setLoading(true);
    setTimeout(() => {
      updateSanPham(editingProduct.id, values);
      setIsEditModalVisible(false);
      setEditingProduct(null);
      message.success('Cập nhật sản phẩm thành công!');
      setLoading(false);
    }, 500);
  }, [editingProduct, updateSanPham]);

  const handleDeleteSanPham = (id: number, name: string) => {
    deleteSanPham(id);
    message.success(`Xóa sản phẩm "${name}" thành công!`);
  };

  const handleEditClick = (product: SanPham) => {
    setEditingProduct(product);
    setIsEditModalVisible(true);
  };

  const getStatusColor = (quantity: number) => {
    const status = getSanPhamStatus(quantity);
    if (status === 'Còn hàng') return 'green';
    if (status === 'Sắp hết') return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
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
        <span>{quantity}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'quantity',
      key: 'status',
      width: 120,
      render: (quantity: number) => {
        const status = getSanPhamStatus(quantity);
        return <Tag color={getStatusColor(quantity)}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (_: any, record: SanPham) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Tổng sản phẩm</div>
              <div className={styles.value}>{sanPhams.length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Giá trị tồn kho</div>
              <div className={styles.value}>
                {(sanPhams.reduce((sum, sp) => sum + (sp.price * sp.quantity), 0)).toLocaleString('vi-VN')} đ
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Còn hàng</div>
              <div className={styles.value}>{sanPhams.filter(sp => getSanPhamStatus(sp.quantity) === 'Còn hàng').length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Hết hàng</div>
              <div className={styles.value}>{sanPhams.filter(sp => getSanPhamStatus(sp.quantity) === 'Hết hàng').length}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Input.Search
              placeholder="Tìm kiếm theo tên..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Chọn danh mục"
              allowClear
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              options={[
                { label: 'Tất cả danh mục', value: undefined },
                ...categories.map(cat => ({ label: cat, value: cat }))
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { label: 'Tất cả', value: undefined },
                { label: 'Còn hàng', value: 'Còn hàng' },
                { label: 'Sắp hết', value: 'Sắp hết' },
                { label: 'Hết hàng', value: 'Hết hàng' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Sắp xếp"
              value={sortType}
              onChange={setSortType}
              style={{ width: '100%' }}
              options={[
                { label: 'Không sắp xếp', value: null },
                { label: 'Tên (A-Z)', value: 'name' },
                { label: 'Giá (thấp-cao)', value: 'price-asc' },
                { label: 'Giá (cao-thấp)', value: 'price-desc' },
                { label: 'Số lượng', value: 'quantity' }
              ]}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col xs={24}>
            <span style={{ marginRight: 16 }}>Khoảng giá:</span>
            <Slider
              range
              min={0}
              max={30000000}
              step={1000000}
              value={priceRange}
              onChange={setPriceRange}
              marks={{
                0: '0đ',
                30000000: '30M'
              }}
              style={{ marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, color: '#666' }}>
              {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
            </div>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredSanPhams}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
          position: ['bottomCenter'],
          onChange: (_, pageSize) => setPageSize(pageSize),
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

      {editingProduct && (
        <EditSanPhamModal
          visible={isEditModalVisible}
          product={editingProduct}
          onOk={handleEditSanPham}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingProduct(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SanPhamPage;
