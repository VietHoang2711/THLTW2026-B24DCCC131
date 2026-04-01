import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Table } from 'antd';
import Chart from 'react-apexcharts';
import { getThongKeTongQuanData, getThongKeTheoCauLacBo } from '@/services/CauLacBo';
import type { CauLacBo } from '@/models/caulacbo';

interface QuanLyThongKeProps {
  caulacbos: CauLacBo[];
}

interface ThongKeData {
  numberOfClubs: number;
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

interface ThongKeChartData {
  tenCauLacBo: string;
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

const ThongKe: React.FC<QuanLyThongKeProps> = ({ caulacbos }) => {
  const [thongKe, setThongKe] = useState<ThongKeData | null>(null);
  const [chartData, setChartData] = useState<ThongKeChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadThongKe = async () => {
    setLoading(true);
    try {
      const [tongQuanRes, theoClbRes] = await Promise.all([
        getThongKeTongQuanData(),
        getThongKeTheoCauLacBo(),
      ]);

      setThongKe(tongQuanRes?.data);

      // Process chart data
      const chartDataProcessed = (theoClbRes?.data || []).map((item: any) => {
        const clb = caulacbos.find((c) => c.id === item.caulacboId);
        return {
          tenCauLacBo: clb?.tenCauLacBo || 'N/A',
          pending: item.pending || 0,
          approved: item.approved || 0,
          rejected: item.rejected || 0,
          total: (item.pending || 0) + (item.approved || 0) + (item.rejected || 0),
        };
      });

      setChartData(chartDataProcessed);
    } catch (error) {
      message.error('Lỗi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThongKe();
  }, [caulacbos]);

  // Listen to data changes
  useEffect(() => {
    const handleDataChanged = () => {
      console.log('ThongKe: Data changed event received');
      loadThongKe();
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

  const columns = [
    {
      title: 'Câu lạc bộ',
      dataIndex: 'tenCauLacBo',
      key: 'tenCauLacBo',
      width: 200,
    },
    {
      title: 'Chưa duyệt',
      dataIndex: 'pending',
      key: 'pending',
      width: 100,
      render: (text: number) => <span style={{ color: '#faad14', fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Đã duyệt',
      dataIndex: 'approved',
      key: 'approved',
      width: 100,
      render: (text: number) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Từ chối',
      dataIndex: 'rejected',
      key: 'rejected',
      width: 100,
      render: (text: number) => <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (text: number) => <strong>{text}</strong>,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="caulacbo-page">
        {/* Thống kê tổng quan */}
        <Row gutter={16} className="statistics-row" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số Câu lạc bộ"
                value={thongKe?.numberOfClubs || 0}
                valueStyle={{ color: '#1890ff', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng số đơn đăng ký"
                value={thongKe?.totalApplications || 0}
                valueStyle={{ color: '#722ed1', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn chưa duyệt"
                value={thongKe?.pendingCount || 0}
                prefix="⏳"
                valueStyle={{ color: '#faad14', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn đã duyệt"
                value={thongKe?.approvedCount || 0}
                prefix="✓"
                valueStyle={{ color: '#52c41a', fontSize: 28 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn bị từ chối"
                value={thongKe?.rejectedCount || 0}
                prefix="✕"
                valueStyle={{ color: '#ff4d4f', fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ */}
        <Card title="Biểu đồ số đơn đăng ký theo câu lạc bộ" className="chart-container">
          {chartData.length > 0 ? (
            <Chart
              type="bar"
              series={[
                {
                  name: 'Chưa duyệt',
                  data: chartData.map((item) => item.pending),
                },
                {
                  name: 'Đã duyệt',
                  data: chartData.map((item) => item.approved),
                },
                {
                  name: 'Từ chối',
                  data: chartData.map((item) => item.rejected),
                },
              ]}
              options={{
                chart: { type: 'bar', height: 400 },
                colors: ['#faad14', '#52c41a', '#ff4d4f'],
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '55%',
                  },
                },
                dataLabels: { enabled: false },
                stroke: { show: true, width: 2, colors: ['transparent'] },
                xaxis: {
                  categories: chartData.map((item) => item.tenCauLacBo),
                },
                yaxis: {
                  title: { text: 'Số lượng' },
                },
                fill: { opacity: 1 },
                tooltip: { y: { formatter: (val: number) => `${val} đơn` } },
                legend: { position: 'bottom', horizontalAlign: 'right' },
              }}
              width="100%"
              height={400}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              Không có dữ liệu
            </div>
          )}
        </Card>

        {/* Bảng chi tiết */}
        <Card
          title="Chi tiết số đơn đăng ký theo câu lạc bộ"
          style={{ marginTop: 24 }}
        >
          <Table
            columns={columns}
            dataSource={chartData}
            rowKey="tenCauLacBo"
            pagination={false}
            scroll={{ x: 600 }}
          />
        </Card>
      </div>
    </Spin>
  );
};

export default ThongKe;
