import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  Space,
  Pie,
  Bar,
  Area,
  Chart,
} from 'antd';
import { DollarOutlined, UserOutlined, ShoppingOutlined, CalendarOutlined, StarFilled } from '@ant-design/icons';
import { useLichHenModel, LichHen } from '@/models/dichvu';
import { useNhanVienModel } from '@/models/dichvu';
import { useDichVuModel } from '@/models/dichvu';
import { useDanhGiaModel } from '@/models/dichvu';
import dayjs from 'dayjs';

type ThangNamType = 'thang' | 'nam';

export default function ThongKePage() {
  const { lichHens } = useLichHenModel();
  const { nhanViens } = useNhanVienModel();
  const { dichVus } = useDichVuModel();
  const { danhGias } = useDanhGiaModel();
  const [loaiThongKe, setLoaiThongKe] = useState<ThangNamType>('thang');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const thongKeChung = useMemo(() => {
    const hoanThanh = lichHens.filter((lh) => lh.trangThai === 'hoan_thanh');
    const doanhThu = hoanThanh.reduce((sum, lh) => sum + lh.tienThanhToan, 0);
    const khachDuy = new Set(hoanThanh.map((lh) => lh.khachHangId)).size;
    const diemTB =
      danhGias.length > 0
        ? (danhGias.reduce((sum, dg) => sum + dg.diem, 0) / danhGias.length).toFixed(1)
        : '0';

    return {
      tongLichHen: lichHens.length,
      lichHenHoanThanh: hoanThanh.length,
      doanhThu,
      khachDuy,
      diemTB,
    };
  }, [lichHens, danhGias]);

  const thongKeDichVu = useMemo(() => {
    const data = dichVus.map((dv) => {
      const lichHen = lichHens.filter(
        (lh) => lh.dichVuId === dv.id && lh.trangThai === 'hoan_thanh'
      );
      return {
        tenDichVu: dv.tenDichVu,
        soLuong: lichHen.length,
        doanhThu: lichHen.reduce((sum, lh) => sum + lh.tienThanhToan, 0),
        gia: dv.gia,
      };
    });

    return data.filter((d) => d.soLuong > 0).sort((a, b) => b.doanhThu - a.doanhThu);
  }, [lichHens, dichVus]);

  const thongKeNhanVien = useMemo(() => {
    const data = nhanViens.map((nv) => {
      const lichHen = lichHens.filter(
        (lh) => lh.nhanVienId === nv.id && lh.trangThai === 'hoan_thanh'
      );
      const doanhThu = lichHen.reduce((sum, lh) => sum + lh.tienThanhToan, 0);
      return {
        key: nv.id,
        hoTen: nv.hoTen,
        soLichHen: lichHen.length,
        doanhThu,
        diem: nv.diem.toFixed(1),
      };
    });

    return data.filter((d) => d.soLichHen > 0).sort((a, b) => b.doanhThu - a.doanhThu);
  }, [lichHens, nhanViens]);

  const thongKeLichHenTheoNgay = useMemo(() => {
    const groupBy = loaiThongKe === 'thang'
      ? (date: string) => dayjs(date).format('YYYY-MM-DD')
      : (date: string) => dayjs(date).format('YYYY-MM');

    const grouped: Record<string, number> = {};
    lichHens.forEach((lh) => {
      if (lh.trangThai === 'hoan_thanh') {
        const key = groupBy(lh.ngayHen);
        grouped[key] = (grouped[key] || 0) + 1;
      }
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [lichHens, loaiThongKe]);

  const thongKeDoanhThuTheoNgay = useMemo(() => {
    const groupBy = loaiThongKe === 'thang'
      ? (date: string) => dayjs(date).format('YYYY-MM-DD')
      : (date: string) => dayjs(date).format('YYYY-MM');

    const grouped: Record<string, number> = {};
    lichHens.forEach((lh) => {
      if (lh.trangThai === 'hoan_thanh') {
        const key = groupBy(lh.ngayHen);
        grouped[key] = (grouped[key] || 0) + lh.tienThanhToan;
      }
    });

    return Object.entries(grouped)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [lichHens, loaiThongKe]);

  const dichVuColumns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      sorter: (a: any, b: any) => a.soLuong - b.soLuong,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'doanhThu',
      key: 'doanhThu',
      render: (doanhthu: number) => <span>{doanhthu.toLocaleString()} đ</span>,
      sorter: (a: any, b: any) => a.doanhThu - b.doanhThu,
    },
  ];

  const nhanVienColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Số lịch hẹn',
      dataIndex: 'soLichHen',
      key: 'soLichHen',
      sorter: (a: any, b: any) => a.soLichHen - b.soLichHen,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'doanhThu',
      key: 'doanhThu',
      render: (doanhthu: number) => <span>{doanhthu.toLocaleString()} đ</span>,
      sorter: (a: any, b: any) => a.doanhThu - b.doanhThu,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'diem',
      key: 'diem',
      sorter: (a: any, b: any) => parseFloat(b.diem) - parseFloat(a.diem),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={thongKeChung.doanhThu}
              prefix={<DollarOutlined />}
              suffix="đ"
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lịch hẹn hoàn thành"
              value={thongKeChung.lichHenHoanThanh}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Khách hàng duy nhất"
              value={thongKeChung.khachDuy}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đánh giá trung bình"
              value={thongKeChung.diemTB}
              prefix={<StarFilled />}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu theo dịch vụ"
            bodyStyle={{ padding: '20px 20px' }}
          >
            <Table
              columns={dichVuColumns}
              dataSource={thongKeDichVu}
              pagination={false}
              rowKey="tenDichVu"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu theo nhân viên"
            bodyStyle={{ padding: '20px 20px' }}
          >
            <Table
              columns={nhanVienColumns}
              dataSource={thongKeNhanVien}
              pagination={false}
              rowKey="key"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title="Thống kê theo thời gian"
            extra={
              <Space>
                <Select
                  value={loaiThongKe}
                  onChange={setLoaiThongKe}
                  style={{ width: 120 }}
                  options={[
                    { label: 'Theo tháng', value: 'thang' },
                    { label: 'Theo năm', value: 'nam' },
                  ]}
                />
              </Space>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <h4>Số lượt  hẹn</h4>
                <pre>{JSON.stringify(thongKeLichHenTheoNgay, null, 2)}</pre>
              </div>
              <div style={{ flex: 1 }}>
                <h4>Doanh thu</h4>
                <pre>{JSON.stringify(thongKeDoanhThuTheoNgay, null, 2)}</pre>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
