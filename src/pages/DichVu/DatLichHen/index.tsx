import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  DatePicker,
  TimePicker,
  Statistic,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useLichHenModel, LichHen } from '@/models/dichvu';
import { useNhanVienModel } from '@/models/dichvu';
import { useDichVuModel } from '@/models/dichvu';
import dayjs from 'dayjs';

const trangThaiOptions = [
  { label: 'Chờ duyệt', value: 'cho_duyet', color: 'orange' },
  { label: 'Xác nhận', value: 'xac_nhan', color: 'blue' },
  { label: 'Hoàn thành', value: 'hoan_thanh', color: 'green' },
  { label: 'Hủy', value: 'huy', color: 'red' },
];

const phuongThucThanhToanOptions = [
  { label: 'Tiền mặt', value: 'tien_mat' },
  { label: 'Card', value: 'card' },
  { label: 'Chuyển khoản', value: 'chuyen_khoan' },
  { label: 'Chưa thanh toán', value: 'chua_thanh_toan' },
];

export default function LichHenPage() {
  const { lichHens, addLichHen, updateTrangThaiLichHen, kiemTraLichTrung } = useLichHenModel();
  const { nhanViens } = useNhanVienModel();
  const { dichVus } = useDichVuModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filterTrangThai, setFilterTrangThai] = useState<string | null>(null);

  const filteredLichHens = useMemo(() => {
    if (!filterTrangThai) return lichHens;
    return lichHens.filter((lh) => lh.trangThai === filterTrangThai);
  }, [lichHens, filterTrangThai]);

  const thongKe = useMemo(() => {
    return {
      tongLichHen: lichHens.length,
      choDuyet: lichHens.filter((lh) => lh.trangThai === 'cho_duyet').length,
      daXacNhan: lichHens.filter((lh) => lh.trangThai === 'xac_nhan').length,
      daHoanThanh: lichHens.filter((lh) => lh.trangThai === 'hoan_thanh').length,
      daHuy: lichHens.filter((lh) => lh.trangThai === 'huy').length,
      doanhThuHomNay: lichHens
        .filter(
          (lh) =>
            lh.ngayHen.startsWith(dayjs().format('YYYY-MM-DD')) &&
            lh.trangThai === 'hoan_thanh'
        )
        .reduce((sum, lh) => sum + lh.tienThanhToan, 0),
    };
  }, [lichHens]);

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'khachHangTen',
      key: 'khachHangTen',
      width: 120,
      render: (text: string, record: LichHen) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{record.khachHangSDT}</div>
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      key: 'nhanVienId',
      width: 100,
      render: (_, record: LichHen) => {
        const nv = nhanViens.find((n) => n.id === record.nhanVienId);
        return <span>{nv?.hoTen || record.nhanVienId}</span>;
      },
    },
    {
      title: 'Dịch vụ',
      key: 'dichVuId',
      width: 120,
      render: (_, record: LichHen) => {
        const dv = dichVus.find((d) => d.id === record.dichVuId);
        return <span>{dv?.tenDichVu || record.dichVuId}</span>;
      },
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'ngayHen',
      key: 'ngayHen',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: LichHen, b: LichHen) => new Date(a.ngayHen).getTime() - new Date(b.ngayHen).getTime(),
    },
    {
      title: 'Giờ hẹn',
      key: 'thoiGian',
      width: 100,
      render: (_, record: LichHen) => `${record.thoiGianBatDau} - ${record.thoiGianKetThuc}`,
    },
    {
      title: 'Giá',
      dataIndex: 'tienThanhToan',
      key: 'tienThanhToan',
      width: 80,
      render: (gia: number) => <span className="font-bold">{gia.toLocaleString()} đ</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 100,
      render: (status: string) => {
        const option = trangThaiOptions.find((o) => o.value === status);
        return <Tag color={option?.color}>{option?.label}</Tag>;
      },
      filters: trangThaiOptions.map((o) => ({ text: o.label, value: o.value })),
      onFilter: (value: any, record: LichHen) => record.trangThai === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: LichHen) => (
        <Space size="small">
          {record.trangThai === 'cho_duyet' && (
            <>
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  updateTrangThaiLichHen(record.id, 'xac_nhan');
                  message.success('Xác nhận lịch hẹn');
                }}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: 'Hủy lịch hẹn',
                    content: 'Nhập lý do hủy:',
                    input: { type: 'text' },
                    onOk: (lyDo) => {
                      updateTrangThaiLichHen(record.id, 'huy');
                      message.success('Hủy lịch hẹn thành công');
                    },
                  });
                }}
              />
            </>
          )}
          {record.trangThai === 'xac_nhan' && (
            <Button
              type="text"
              size="small"
              onClick={() => {
                updateTrangThaiLichHen(record.id, 'hoan_thanh');
                message.success('Hoàn thành lịch hẹn');
              }}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const selectedDV = dichVus.find((dv) => dv.id === values.dichVuId);
      const thoiGianKetThuc = dayjs(values.thoiGianBatDau)
        .add(selectedDV?.thoiGianThucHien || 30, 'minutes')
        .format('HH:mm');

      // Kiểm tra lịch trùng
      if (
        kiemTraLichTrung(
          values.nhanVienId,
          values.ngayHen.format('YYYY-MM-DD'),
          values.thoiGianBatDau.format('HH:mm'),
          thoiGianKetThuc,
          editingId || undefined
        )
      ) {
        message.error('Nhân viên này đã có lịch hẹn trong khung giờ này');
        setLoading(false);
        return;
      }

      const lichHenData = {
        khachHangId: `kh${Date.now()}`,
        khachHangTen: values.khachHangTen,
        khachHangSDT: values.khachHangSDT,
        khachHangEmail: values.khachHangEmail,
        nhanVienId: values.nhanVienId,
        dichVuId: values.dichVuId,
        ngayHen: values.ngayHen.toISOString(),
        thoiGianBatDau: values.thoiGianBatDau.format('HH:mm'),
        thoiGianKetThuc: thoiGianKetThuc,
        ghiChu: values.ghiChu || '',
        trangThai: 'cho_duyet' as const,
        tienThanhToan: selectedDV?.gia || 0,
        phuongThucThanhToan: values.phuongThucThanhToan || 'chua_thanh_toan',
      };

      addLichHen(lichHenData);
      message.success('Tạo lịch hẹn thành công');
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Tổng lịch hẹn" value={thongKe.tongLichHen} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Chờ duyệt" value={thongKe.choDuyet} valueStyle={{ color: '#faad14' }} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Doanh thu hôm nay"
            value={thongKe.doanhThuHomNay}
            suffix="đ"
            precision={0}
          />
        </Col>
      </Row>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Đặt lịch hẹn
          </Button>
          <Select
            style={{ width: 150 }}
            placeholder="Lọc trạng thái"
            allowClear
            onChange={setFilterTrangThai}
            options={trangThaiOptions.map((o) => ({ label: o.label, value: o.value }))}
          />
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredLichHens}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title="Đặt lịch hẹn mới"
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Tên khách hàng"
                name="khachHangTen"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="SĐT khách hàng"
                name="khachHangSDT"
                rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
              >
                <Input placeholder="0901234567" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email khách hàng"
            name="khachHangEmail"
            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            label="Dịch vụ"
            name="dichVuId"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
          >
            <Select
              placeholder="Chọn dịch vụ"
              options={dichVus.map((dv) => ({
                label: `${dv.tenDichVu} (${dv.gia.toLocaleString()} đ)`,
                value: dv.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Nhân viên"
            name="nhanVienId"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            <Select
              placeholder="Chọn nhân viên"
              options={nhanViens
                .filter((nv) => nv.trangThai === 'hoat_dong')
                .map((nv) => ({
                  label: `${nv.hoTen} (${nv.diem.toFixed(1)}⭐)`,
                  value: nv.id,
                }))}
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Ngày hẹn"
                name="ngayHen"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giờ bắt đầu"
                name="thoiGianBatDau"
                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Phương thức thanh toán"
            name="phuongThucThanhToan"
            initialValue="chua_thanh_toan"
          >
            <Select options={phuongThucThanhToanOptions} />
          </Form.Item>

          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea placeholder="Ghi chú thêm..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
