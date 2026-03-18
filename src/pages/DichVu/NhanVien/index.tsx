import React, { useState, useEffect } from 'react';
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
  TimePicker,

  Rate,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNhanVienModel, NhanVien } from '@/models/dichvu';
import { useDichVuModel } from '@/models/dichvu';
import dayjs from 'dayjs';

const trangThaiOptions = [
  { label: 'Hoạt động', value: 'hoat_dong' },
  { label: 'Tạm ngừng', value: 'tam_ngung' },
  { label: 'Nghỉ phép', value: 'nghi_phep' },
];

const thuOptions = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 1 },
];

export default function NhanVienPage() {
  const { nhanViens, addNhanVien, updateNhanVien, deleteNhanVien } = useNhanVienModel();
  const { dichVus } = useDichVuModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 120,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 110,
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'chuyenMon',
      key: 'chuyenMon',
      width: 150,
      render: (chuyenMon: string[]) => (
        <Space size="small" wrap>
          {chuyenMon.map((cmId) => {
            const dv = dichVus.find((d) => d.id === cmId);
            return <Tag key={cmId}>{dv?.tenDichVu || cmId}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: 'Khách/ngày',
      dataIndex: 'soKhachToiDa',
      key: 'soKhachToiDa',
      width: 80,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'diem',
      key: 'diem',
      width: 120,
      render: (diem: number, record: NhanVien) => (
        <div>
          <Rate disabled value={Math.round(diem)} />
          <span style={{ marginLeft: 8 }}>
            {diem.toFixed(1)} ({record.quantamDanhGia})
          </span>
        </div>
      ),
      sorter: (a: NhanVien, b: NhanVien) => a.diem - b.diem,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 100,
      render: (status: string) => {
        const colors = {
          hoat_dong: 'green',
          tam_ngung: 'orange',
          nghi_phep: 'blue',
        };
        const labels = {
          hoat_dong: 'Hoạt động',
          tam_ngung: 'Tạm ngừng',
          nghi_phep: 'Nghỉ phép',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: NhanVien) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: NhanVien) => {
    form.setFieldsValue({
      hoTen: record.hoTen,
      email: record.email,
      soDienThoai: record.soDienThoai,
      chuyenMon: record.chuyenMon,
      soKhachToiDa: record.soKhachToiDa,
      trangThai: record.trangThai,
    });
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNhanVien(id);
    message.success('Xóa nhân viên thành công');
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        updateNhanVien(editingId, {
          ...values,
          lichLamViec: new Map(),
        });
        message.success('Cập nhật nhân viên thành công');
      } else {
        addNhanVien({
          ...values,
          lichLamViec: new Map(),
        });
        message.success('Thêm nhân viên thành công');
      }
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
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm nhân viên
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={nhanViens}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
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
                label="Họ tên"
                name="hoTen"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Số điện thoại"
            name="soDienThoai"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="0901234567" />
          </Form.Item>

          <Form.Item
            label="Chuyên môn (dịch vụ)"
            name="chuyenMon"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 dịch vụ' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ"
              options={dichVus.map((dv) => ({
                label: dv.tenDichVu,
                value: dv.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Số khách tối đa/ngày"
            name="soKhachToiDa"
            initialValue={5}
            rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
          >
            <Select
              options={[
                { label: '3 khách', value: 3 },
                { label: '4 khách', value: 4 },
                { label: '5 khách', value: 5 },
                { label: '6 khách', value: 6 },
                { label: '7 khách', value: 7 },
                { label: '8 khách', value: 8 },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="trangThai"
            initialValue="hoat_dong"
            rules={[{ required: true }]}
          >
            <Select options={trangThaiOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
