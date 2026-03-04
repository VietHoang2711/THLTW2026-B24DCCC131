import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Progress, Tag, Table, Empty } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSanPhamModel } from '@/models/sanpham';
import { useDonHangModel } from '@/models/donhang';
import styles from './index.less';
import dayjs from 'dayjs';

const DashboardPage: React.FC = () => {
  const { sanPhams, getSanPhamStatus } = useSanPhamModel();
  const { donHangs, getDonHangsByStatus, getCompletedOrdersRevenue } = useDonHangModel();

  const stats = useMemo(() => {
    const totalProducts = sanPhams.length;
    const totalInventoryValue = sanPhams.reduce((sum, sp) => sum + (sp.price * sp.quantity), 0);
    const totalOrders = donHangs.length;
    const completedOrders = getDonHangsByStatus('Hoàn thành').length;
    const revenue = getCompletedOrdersRevenue();

    const productStats = {
      inStock: sanPhams.filter(sp => getSanPhamStatus(sp.quantity) === 'Còn hàng').length,
      lowStock: sanPhams.filter(sp => getSanPhamStatus(sp.quantity) === 'Sắp hết').length,
      outOfStock: sanPhams.filter(sp => getSanPhamStatus(sp.quantity) === 'Hết hàng').length,
    };

    const orderStats = {
      pending: getDonHangsByStatus('Chờ xử lý').length,
      shipping: getDonHangsByStatus('Đang giao').length,
      completed: completedOrders,
      cancelled: getDonHangsByStatus('Đã hủy').length,
    };

    return {
      totalProducts,
      totalInventoryValue,
      totalOrders,
      revenue,
      productStats,
      orderStats,
    };
  }, [sanPhams, donHangs, getSanPhamStatus, getDonHangsByStatus, getCompletedOrdersRevenue]);

  const lowStockProducts = useMemo(() => {
    return sanPhams
      .filter(sp => sp.quantity > 0 && sp.quantity <= 10)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  }, [sanPhams]);

  const recentOrders = useMemo(() => {
    return donHangs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [donHangs]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Bảng điều khiển</h1>
      </div>

      {/* Main Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={stats.totalInventoryValue}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#52c41a', fontSize: 18 }}
              formatter={(value) => (value as number).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              prefix={<CheckCircleOutlined />}
              suffix="đ"
              valueStyle={{ color: '#eb2f96', fontSize: 18 }}
              formatter={(value) => (value as number).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      {/* Product Status */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái sản phẩm">
            <Row gutter={16}>
              <Col xs={8}>
                <div className={styles.statusCard}>
                  <div className={styles.statusValue} style={{ color: '#52c41a' }}>
                    {stats.productStats.inStock}
                  </div>
                  <div className={styles.statusLabel}>Còn hàng</div>
                  <Progress
                    type="circle"
                    percent={Math.round((stats.productStats.inStock / stats.totalProducts) * 100)}
                    width={80}
                    strokeColor="#52c41a"
                  />
                </div>
              </Col>
              <Col xs={8}>
                <div className={styles.statusCard}>
                  <div className={styles.statusValue} style={{ color: '#faad14' }}>
                    {stats.productStats.lowStock}
                  </div>
                  <div className={styles.statusLabel}>Sắp hết</div>
                  <Progress
                    type="circle"
                    percent={Math.round((stats.productStats.lowStock / stats.totalProducts) * 100)}
                    width={80}
                    strokeColor="#faad14"
                  />
                </div>
              </Col>
              <Col xs={8}>
                <div className={styles.statusCard}>
                  <div className={styles.statusValue} style={{ color: '#f5222d' }}>
                    {stats.productStats.outOfStock}
                  </div>
                  <div className={styles.statusLabel}>Hết hàng</div>
                  <Progress
                    type="circle"
                    percent={Math.round((stats.productStats.outOfStock / stats.totalProducts) * 100)}
                    width={80}
                    strokeColor="#f5222d"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Order Status */}
        <Col xs={24} lg={12}>
          <Card title="Trạng thái đơn hàng">
            <Row gutter={16}>
              <Col xs={6}>
                <div className={styles.orderStatusCard}>
                  <div className={styles.orderValue}>{stats.orderStats.pending}</div>
                  <div className={styles.orderLabel}>Chờ xử lý</div>
                  <Tag color="gold">Pending</Tag>
                </div>
              </Col>
              <Col xs={6}>
                <div className={styles.orderStatusCard}>
                  <div className={styles.orderValue}>{stats.orderStats.shipping}</div>
                  <div className={styles.orderLabel}>Đang giao</div>
                  <Tag color="blue">Shipping</Tag>
                </div>
              </Col>
              <Col xs={6}>
                <div className={styles.orderStatusCard}>
                  <div className={styles.orderValue}>{stats.orderStats.completed}</div>
                  <div className={styles.orderLabel}>Hoàn thành</div>
                  <Tag color="green">Done</Tag>
                </div>
              </Col>
              <Col xs={6}>
                <div className={styles.orderStatusCard}>
                  <div className={styles.orderValue}>{stats.orderStats.cancelled}</div>
                  <div className={styles.orderLabel}>Đã hủy</div>
                  <Tag color="red">Cancel</Tag>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="⚠️ Sản phẩm sắp hết" className={styles.alertCard}>
            {lowStockProducts.length > 0 ? (
              <Table
                columns={[
                  { title: 'Sản phẩm', dataIndex: 'name', key: 'name', ellipsis: true },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: 80,
                    render: (qty: number) => (
                      <Tag color={qty <= 5 ? 'red' : 'orange'}>{qty}</Tag>
                    )
                  }
                ]}
                dataSource={lowStockProducts}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có sản phẩm sắp hết" />
            )}
          </Card>
        </Col>

        {/* Recent Orders */}
        <Col xs={24} lg={12}>
          <Card title="Đơn hàng gần đây">
            {recentOrders.length > 0 ? (
              <Table
                columns={[
                  { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: 70 },
                  { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', ellipsis: true },
                  {
                    title: 'Tổng tiền',
                    dataIndex: 'totalAmount',
                    key: 'totalAmount',
                    width: 80,
                    render: (amount: number) => `${(amount / 1000000).toFixed(1)}M`
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    width: 90,
                    render: (status: string) => {
                      const colors: { [key: string]: string } = {
                        'Chờ xử lý': 'gold',
                        'Đang giao': 'blue',
                        'Hoàn thành': 'green',
                        'Đã hủy': 'red'
                      };
                      return <Tag color={colors[status] || 'default'}>{status}</Tag>;
                    }
                  }
                ]}
                dataSource={recentOrders}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có đơn hàng nào" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Category Distribution */}
      <Row gutter={24}>
        <Col xs={24}>
          <Card title="Phân bố sản phẩm theo danh mục">
            {sanPhams.length > 0 ? (
              <Table
                columns={[
                  { title: 'Danh mục', dataIndex: 'category', key: 'category' },
                  {
                    title: 'Số lượng',
                    key: 'count',
                    width: 100,
                    render: (_: any, __: any, __index: any) => {
                      const categories = Array.from(new Set(sanPhams.map(sp => sp.category)));
                      const category = categories[__index];
                      return sanPhams.filter(sp => sp.category === category).length;
                    }
                  },
                  {
                    title: 'Giá trị',
                    key: 'value',
                    render: (_: any, record: any) => {
                      const value = sanPhams
                        .filter(sp => sp.category === record.category)
                        .reduce((sum, sp) => sum + (sp.price * sp.quantity), 0);
                      return `${value.toLocaleString('vi-VN')}đ`;
                    }
                  }
                ]}
                dataSource={Array.from(new Set(sanPhams.map(sp => sp.category))).map(cat => ({ category: cat }))}
                rowKey="category"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
