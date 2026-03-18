import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Popconfirm,
  Tag,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDichVuModel, DichVu } from '@/models/dichvu';

const loaiDichVuOptions = [
  { label: 'Cắt tóc', value: 'cat_toc' },
  { label: 'Spa', value: 'spa' },
  { label: 'Khám bệnh', value: 'kham_benh' },
  { label: 'Sữa chữa', value: 'sua_chua' },
  { label: 'Khác', value: 'khac' },
];

const trangThaiOptions = [
  { label: 'Hoạt động', value: 'hoat_dong' },
  { label: 'Tạm ngừng', value: 'tam_ngung' },
];

export default function DichVuPage() {
  const { dichVus, addDichVu, updateDichVu, deleteDichVu } = useDichVuModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
      width: 150,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: 200,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'gia',
      key: 'gia',
      width: 100,
      render: (gia: number) => <span className="font-bold">{gia.toLocaleString()}</span>,
      sorter: (a: DichVu, b: DichVu) => a.gia - b.gia,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'thoiGianThucHien',
      key: 'thoiGianThucHien',
      width: 100,
      sorter: (a: DichVu, b: DichVu) => a.thoiGianThucHien - b.thoiGianThucHien,
    },
    {
      title: 'Loại',
      dataIndex: 'loaiDichVu',
      key: 'loaiDichVu',
      width: 100,
      render: (loai: string) => {
        const loaiLabel = loaiDichVuOptions.find((l) => l.value === loai)?.label;
        return <Tag color="blue">{loaiLabel}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'hoat_dong' ? 'green' : 'red'}>
          {status === 'hoat_dong' ? 'Hoạt động' : 'Tạm ngừng'}
        </Tag>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'trongSoUuTien',
      key: 'trongSoUuTien',
      width: 80,
      sorter: (a: DichVu, b: DichVu) => a.trongSoUuTien - b.trongSoUuTien,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: DichVu) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Xóa dịch vụ"
            description="Bạn có chắc chắn muốn xóa dịch vụ này không?"
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

  const handleEdit = (record: DichVu) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteDichVu(id);
    message.success('Xóa dịch vụ thành công');
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        updateDichVu(editingId, values);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        addDichVu(values);
        message.success('Thêm dịch vụ thành công');
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
          Thêm dịch vụ
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={dichVus}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên dịch vụ"
            name="tenDichVu"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input placeholder="Ví dụ: Cắt tóc nam" />
          </Form.Item>

          <Form.Item label="Mô tả" name="moTa">
            <Input.TextArea placeholder="Mô tả chi tiết về dịch vụ" rows={4} />
          </Form.Item>

          <Form.Item
            label="Giá (VND)"
            name="gia"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Thời gian thực hiện (phút)"
            name="thoiGianThucHien"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Loại dịch vụ"
            name="loaiDichVu"
            rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
          >
            <Select options={loaiDichVuOptions} />
          </Form.Item>

          <Form.Item
            label="Ưu tiên (1-10)"
            name="trongSoUuTien"
            initialValue={5}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="trangThai"
            initialValue="hoat_dong"
            rules={[{ required: true }]}
          >
            <Select options={trangThaiOptions} />
          </Form.Item>

          <Form.Item label="Hình ảnh URL" name="hinh">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
