import React from 'react';
import { Card, Row, Col, Statistic, Progress, Space } from 'antd';
import { UserOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { NhanVien } from '@/models/dichvu';

interface NhanVienCardProps {
  nhanVien: NhanVien;
  lichHenCount?: number;
  doanhThu?: number;
}

export default function NhanVienCard({ nhanVien, lichHenCount = 0, doanhThu = 0 }: NhanVienCardProps) {
  return (
    <Card
      title={
        <div>
          <strong>{nhanVien.hoTen}</strong>
          <span style={{ marginLeft: 8, fontSize: '12px', color: '#999' }}>
            {nhanVien.chuyenMon.length} dịch vụ
          </span>
        </div>
      }
      size="small"
      hoverable
    >
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Statistic
            title="Lịch hẹn"
            value={lichHenCount}
            icon={<UserOutlined />}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Đánh giá"
            value={nhanVien.diem}
            icon={<StarOutlined />}
            suffix="/5"
            precision={1}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Khách/ngày"
            value={nhanVien.soKhachToiDa}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ fontSize: '12px', marginBottom: 4 }}>Hiệu suất</div>
        <Progress
          percent={(lichHenCount / (nhanVien.soKhachToiDa * 30)) * 100}
          size="small"
          format={() => `${lichHenCount}/${nhanVien.soKhachToiDa * 30}`}
        />
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '4px 0' }}>📧 {nhanVien.email}</p>
        <p style={{ margin: '4px 0' }}>📱 {nhanVien.soDienThoai}</p>
        <p style={{ margin: '4px 0' }}>Trạng thái: <strong>{nhanVien.trangThai}</strong></p>
      </div>
    </Card>
  );
}
