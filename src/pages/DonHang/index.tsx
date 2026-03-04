import React, { useState, useMemo, useCallback } from 'react';
import { 
  Button, Input, Popconfirm, Space, Table, message, Tag, Select, Drawer, 
  Form, Row, Col, Card, DatePicker, InputNumber, Empty 
} from 'antd';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useDonHangModel, DonHang, DonHangStatus, DonHangProduct } from '@/models/donhang';
import { useSanPhamModel } from '@/models/sanpham';
import { CreateDonHangModal } from './CreateDonHangModal';
import styles from './index.less';
import dayjs from 'dayjs';

type SortType = 'date-new' | 'date-old' | 'amount-asc' | 'amount-desc' | null;

const DonHangPage: React.FC = () => {
  const { donHangs, addDonHang, updateDonHangStatus, deleteDonHang, getDonHangsByStatus, getCompletedOrdersRevenue } = useDonHangModel();
  const { sanPhams, updateProductQuantity } = useSanPhamModel();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<DonHangStatus | undefined>();
  const [dateRange, setDateRange] = useState<any>(null);
  const [sortType, setSortType] = useState<SortType>(null);

  // Filter and sort orders
  const filteredDonHangs = useMemo(() => {
    let filtered = donHangs.filter(dh => {
      const matchSearch = !searchText.trim() || 
        dh.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        dh.id.toLowerCase().includes(searchText.toLowerCase());
      
      const matchStatus = !statusFilter || dh.status === statusFilter;
      
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const orderDate = dayjs(dh.createdAt);
        matchDate = orderDate.isBetween(dateRange[0], dateRange[1], null, '[]');
      }
      
      return matchSearch && matchStatus && matchDate;
    });

    // Sorting
    if (sortType === 'date-new') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortType === 'date-old') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortType === 'amount-asc') {
      filtered = filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (sortType === 'amount-desc') {
      filtered = filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return filtered;
  }, [donHangs, searchText, statusFilter, dateRange, sortType]);

  const handleCreateDonHang = useCallback((values: any) => {
    const products: DonHangProduct[] = values.products.map((productId: number) => {
      const product = sanPhams.find(sp => sp.id === productId);
      const quantity = values[`quantity_${productId}`];
      return {
        productId,
        productName: product?.name || '',
        quantity,
        price: product?.price || 0,
      };
    });

    const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    addDonHang({
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products,
      totalAmount,
      status: 'Chờ xử lý',
    });

    setIsCreateModalVisible(false);
    message.success('Tạo đơn hàng thành công!');
  }, [addDonHang, sanPhams]);

  const handleStatusChange = (orderId: string, newStatus: DonHangStatus) => {
    const order = donHangs.find(dh => dh.id === orderId);
    if (!order) return;

    // Handle inventory updates
    if (order.status !== 'Hoàn thành' && newStatus === 'Hoàn thành') {
      // Reduce inventory when order is completed
      order.products.forEach(product => {
        updateProductQuantity(product.productId, -product.quantity);
      });
    } else if (order.status === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
      // Return inventory when order status changes from completed
      order.products.forEach(product => {
        updateProductQuantity(product.productId, product.quantity);
      });
    } else if (newStatus === 'Đã hủy' && order.status !== 'Đã hủy') {
      // Return inventory when order is cancelled
      order.products.forEach(product => {
        updateProductQuantity(product.productId, product.quantity);
      });
    }

    updateDonHangStatus(orderId, newStatus);
    message.success(`Cập nhật trạng thái đơn hàng thành công!`);
  };

  const handleDeleteDonHang = (id: string) => {
    deleteDonHang(id);
    message.success('Xóa đơn hàng thành công!');
  };

  const handleViewDetail = (order: DonHang) => {
    setSelectedOrder(order);
    setDetailDrawerVisible(true);
  };

  const getStatusColor = (status: DonHangStatus) => {
    switch (status) {
      case 'Chờ xử lý':
        return 'gold';
      case 'Đang giao':
        return 'blue';
      case 'Hoàn thành':
        return 'green';
      case 'Đã hủy':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      width: 100,
      render: (products: DonHangProduct[]) => products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (amount: number) => (
        <span style={{ color: '#1890ff', fontWeight: 600 }}>
          {amount.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: DonHangStatus, record: DonHang) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          style={{ width: '100%' }}
          options={[
            { label: 'Chờ xử lý', value: 'Chờ xử lý' },
            { label: 'Đang giao', value: 'Đang giao' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' }
          ]}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_: any, record: DonHang) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title={`Xóa đơn hàng ${record.id}?`}
            onConfirm={() => handleDeleteDonHang(record.id)}
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
        <h1>Quản lý Đơn hàng</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          Tạo đơn hàng
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Tổng đơn hàng</div>
              <div className={styles.value}>{donHangs.length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Doanh thu</div>
              <div className={styles.value}>
                {getCompletedOrdersRevenue().toLocaleString('vi-VN')} đ
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Chờ xử lý</div>
              <div className={styles.value}>{getDonHangsByStatus('Chờ xử lý').length}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className={styles.statistic}>
              <div className={styles.label}>Hoàn thành</div>
              <div className={styles.value}>{getDonHangsByStatus('Hoàn thành').length}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Input.Search
              placeholder="Tìm kiếm mã hoặc tên khách..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
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
                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                { label: 'Đang giao', value: 'Đang giao' },
                { label: 'Hoàn thành', value: 'Hoàn thành' },
                { label: 'Đã hủy', value: 'Đã hủy' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <DatePicker.RangePicker
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
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
                { label: 'Ngày (mới-cũ)', value: 'date-new' },
                { label: 'Ngày (cũ-mới)', value: 'date-old' },
                { label: 'Tiền (thấp-cao)', value: 'amount-asc' },
                { label: 'Tiền (cao-thấp)', value: 'amount-desc' }
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredDonHangs}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
          position: ['bottomCenter'],
        }}
        locale={{
          emptyText: 'Không có đơn hàng nào',
        }}
      />

      {/* Create Order Modal */}
      <CreateDonHangModal
        visible={isCreateModalVisible}
        products={sanPhams}
        onOk={handleCreateDonHang}
        onCancel={() => setIsCreateModalVisible(false)}
      />

      {/* Detail Drawer */}
      <Drawer
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        placement="right"
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedOrder(null);
        }}
        open={detailDrawerVisible}
        width={600}
      >
        {selectedOrder && (
          <div>
            <div className={styles.detailSection}>
              <h3>Thông tin khách hàng</h3>
              <p><strong>Tên:</strong> {selectedOrder.customerName}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
              <p><strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY')}</p>
              <p><strong>Trạng thái:</strong> <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag></p>
            </div>

            <div className={styles.detailSection}>
              <h3>Danh sách sản phẩm</h3>
              {selectedOrder.products.length > 0 ? (
                <Table
                  columns={[
                    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
                    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 80 },
                    { 
                      title: 'Giá',
                      dataIndex: 'price',
                      key: 'price',
                      width: 100,
                      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`
                    },
                    {
                      title: 'Thành tiền',
                      key: 'subtotal',
                      width: 100,
                      render: (_: any, record: DonHangProduct) => `${(record.price * record.quantity).toLocaleString('vi-VN')}đ`
                    }
                  ]}
                  dataSource={selectedOrder.products}
                  rowKey="productId"
                  pagination={false}
                  size="small"
                />
              ) : (
                <Empty />
              )}
            </div>

            <div className={styles.detailSection} style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
              <h3 style={{ marginBottom: 16 }}>
                Tổng cộng: <span style={{ color: '#1890ff', fontSize: 24 }}>
                  {selectedOrder.totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </h3>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DonHangPage;
