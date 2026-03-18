import { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Tag,
  Card,
  Row,
  Col,
  Rate,
  Empty,
  Statistic,
} from 'antd';

import { useDanhGiaModel, DanhGia } from '@/models/dichvu';
import { useNhanVienModel } from '@/models/dichvu';
import { useLichHenModel } from '@/models/dichvu';
import dayjs from 'dayjs';

export default function DanhGiaPage() {
  const { danhGias, addDanhGia, phanHoiDanhGia, getDiemTrungBinhNhanVien } = useDanhGiaModel();
  const { nhanViens, setDiemNhanVien } = useNhanVienModel();
  const { lichHens } = useLichHenModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhanHoiModalOpen, setIsPhanHoiModalOpen] = useState(false);
  const [selectedDanhGia, setSelectedDanhGia] = useState<DanhGia | null>(null);
  const [form] = Form.useForm();
  const [phanHoiForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Tìm các lịch hẹn đã hoàn thành nhưng chưa có đánh giá
  const lichHenChuaDanhGia = useMemo(() => {
    return lichHens.filter(
      (lh) =>
        lh.trangThai === 'hoan_thanh' &&
        !danhGias.find((dg) => dg.lichHenId === lh.id)
    );
  }, [lichHens, danhGias]);

  const thongKe = useMemo(() => {
    const totalDanhGia = danhGias.length;
    const danhGiaGood = danhGias.filter((dg) => dg.diem >= 4).length;
    const diemTrungBinh =
      totalDanhGia > 0
        ? (danhGias.reduce((sum, dg) => sum + dg.diem, 0) / totalDanhGia).toFixed(1)
        : '0';
    const chuaPhanHoi = danhGias.filter((dg) => dg.trangThaiPhanHoi === 'chua_phan_hoi').length;

    return { totalDanhGia, danhGiaGood, diemTrungBinh, chuaPhanHoi };
  }, [danhGias]);

  const columns = [
    {
      title: 'Nhân viên',
      key: 'nhanVienId',
      width: 120,
      render: (_, record: DanhGia) => {
        const nv = nhanViens.find((n) => n.id === record.nhanVienId);
        return <strong>{nv?.hoTen || 'N/A'}</strong>;
      },
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHangTen',
      key: 'khachHangTen',
      width: 120,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'diem',
      key: 'diem',
      width: 100,
      render: (diem: number) => (
        <div>
          <Rate disabled value={diem} />
          <span style={{ marginLeft: 8, fontWeight: 'bold' }}>{diem}/5</span>
        </div>
      ),
      sorter: (a: DanhGia, b: DanhGia) => a.diem - b.diem,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 150,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'nhanXet',
      key: 'nhanXet',
      width: 200,
      render: (text: string) => (
        <div style={{ maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Phản hồi',
      key: 'phanHoi',
      width: 150,
      render: (_, record: DanhGia) => (
        <Tag color={record.trangThaiPhanHoi === 'da_phan_hoi' ? 'green' : 'orange'}>
          {record.trangThaiPhanHoi === 'da_phan_hoi' ? 'Đã phản hồi' : 'Chưa phản hồi'}
        </Tag>
      ),
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'ngayDanhGia',
      key: 'ngayDanhGia',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (record: DanhGia) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSelectedDanhGia(record);
              setIsPhanHoiModalOpen(true);
              phanHoiForm.setFieldsValue({
                phanHoi: record.phanHoiNhanVien || '',
              });
            }}
          >
            Phản hồi
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddDanhGia = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const danhGiaId = addDanhGia({
        lichHenId: values.lichHenId,
        nhanVienId: values.nhanVienId,
        khachHangId: values.khachHangId,
        khachHangTen: values.khachHangTen,
        diem: values.diem,
        tieuDe: values.tieuDe,
        nhanXet: values.nhanXet,
        anhDinhKem: [],
      });

      // Cập nhật điểm cho nhân viên
      const nhanVien = nhanViens.find((nv) => nv.id === values.nhanVienId);
      if (nhanVien) {
        setDiemNhanVien(values.nhanVienId, values.diem);
      }

      message.success('Thêm đánh giá thành công');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handlePhanHoi = async (values: any) => {
    if (!selectedDanhGia) return;
    setLoading(true);
    try {
      phanHoiDanhGia(selectedDanhGia.id, values.phanHoi);
      message.success('Phản hồi đánh giá thành công');
      setIsPhanHoiModalOpen(false);
      phanHoiForm.resetFields();
      setSelectedDanhGia(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Tổng đánh giá" value={thongKe.totalDanhGia} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Đánh giá tốt (≥4⭐)" value={thongKe.danhGiaGood} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Điểm trung bình"
            value={thongKe.diemTrungBinh}
            suffix="/5"
            precision={1}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Chưa phản hồi"
            value={thongKe.chuaPhanHoi}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddDanhGia}>
          Thêm đánh giá
        </Button>
      </div>

      {lichHenChuaDanhGia.length > 0 && (
        <Card
          style={{ marginBottom: 16 }}
          title="Lịch hẹn chưa có đánh giá"
          type="inner"
        >
          <Empty
            description="Không có lịch hẹn nào chưa có đánh giá"
            style={{ marginTop: 20 }}
          />
          {lichHenChuaDanhGia.map((lh) => (
            <div key={lh.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                {lh.khachHangTen} - {lh.khachHangSDT}
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const nv = nhanViens.find((n) => n.id === lh.nhanVienId);
                    form.setFieldsValue({
                      lichHenId: lh.id,
                      nhanVienId: lh.nhanVienId,
                      khachHangId: lh.khachHangId,
                      khachHangTen: lh.khachHangTen,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Đánh giá ngay
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={danhGias}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Thêm đánh giá"
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="lichHenId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="nhanVienId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="khachHangId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="khachHangTen" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Điểm (1-5⭐)"
            name="diem"
            rules={[
              { required: true, message: 'Vui lòng chọn điểm đánh giá' },
            ]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Tiêu đề"
            name="tieuDe"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Ví dụ: Dịch vụ tuyệt vời" />
          </Form.Item>

          <Form.Item
            label="Nhận xét"
            name="nhanXet"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <Input.TextArea placeholder="Chia sẻ trải nghiệm của bạn..." rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Phản hồi đánh giá"
        visible={isPhanHoiModalOpen}
        onCancel={() => {
          setIsPhanHoiModalOpen(false);
          phanHoiForm.resetFields();
          setSelectedDanhGia(null);
        }}
        onOk={() => phanHoiForm.submit()}
        confirmLoading={loading}
        width={600}
      >
        {selectedDanhGia && (
          <>
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <p>
                <strong>Khách hàng:</strong> {selectedDanhGia.khachHangTen}
              </p>
              <p>
                <strong>Đánh giá:</strong> <Rate disabled value={selectedDanhGia.diem} />
              </p>
              <p>
                <strong>Nhận xét:</strong> {selectedDanhGia.nhanXet}
              </p>
            </div>

            <Form form={phanHoiForm} layout="vertical" onFinish={handlePhanHoi}>
              <Form.Item
                label="Phản hồi"
                name="phanHoi"
                rules={[{ required: true, message: 'Vui lòng nhập phản hồi' }]}
              >
                <Input.TextArea placeholder="Cảm ơn bạn đã đánh giá..." rows={4} />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
}
