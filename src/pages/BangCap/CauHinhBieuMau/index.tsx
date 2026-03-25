import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFormConfigModel, FormFieldConfig, FieldDataType } from '@/models/bangcap';
import dayjs from 'dayjs';

export default function CauHinhBieuMauPage() {
  const { configs, addFieldConfig, updateFieldConfig, deleteFieldConfig } = useFormConfigModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dataTypeOptions = [
    { label: 'Chuỗi (String)', value: 'string' },
    { label: 'Số (Number)', value: 'number' },
    { label: 'Ngày (Date)', value: 'date' },
  ];

  const columns = [
    {
      title: 'Tên Trường',
      dataIndex: 'tenTruong',
      key: 'tenTruong',
      width: 150,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Kiểu Dữ Liệu',
      dataIndex: 'kieuDuLieu',
      key: 'kieuDuLieu',
      width: 150,
      render: (type: FieldDataType) => {
        const labels: Record<FieldDataType, string> = {
          string: 'Chuỗi',
          number: 'Số',
          date: 'Ngày',
        };
        return labels[type];
      },
    },
    {
      title: 'Bắt Buộc',
      dataIndex: 'batBuoc',
      key: 'batBuoc',
      width: 100,
      render: (required: boolean) => (required ? '✓ Có' : '✗ Không'),
    },
    {
      title: 'Thứ Tự',
      dataIndex: 'thuTuHienThi',
      key: 'thuTuHienThi',
      width: 80,
      render: (order: number) => <strong>{order}</strong>,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 150,
      render: (_: any, record: FormFieldConfig) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue({
                tenTruong: record.tenTruong,
                kieuDuLieu: record.kieuDuLieu,
                batBuoc: record.batBuoc,
                thuTuHienThi: record.thuTuHienThi,
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa?"
            onConfirm={() => {
              deleteFieldConfig(record.id);
              message.success('Xóa thành công');
            }}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddFieldConfig = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        updateFieldConfig(editingId, values);
        message.success('Cập nhật cấu hình thành công');
      } else {
        addFieldConfig({
          ...values,
          thuTuHienThi: values.thuTuHienThi || configs.length + 1,
        });
        message.success('Thêm trường thông tin thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFieldConfig}>
          Thêm Trường Thông Tin
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={configs.sort((a, b) => a.thuTuHienThi - b.thuTuHienThi)}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingId ? 'Chỉnh Sửa Trường Thông Tin' : 'Thêm Trường Thông Tin Mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên Trường"
            name="tenTruong"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input placeholder="Ví dụ: Dân tộc, Nơi sinh, Điểm trung bình" />
          </Form.Item>

          <Form.Item
            label="Kiểu Dữ Liệu"
            name="kieuDuLieu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select options={dataTypeOptions} placeholder="Chọn kiểu dữ liệu" />
          </Form.Item>

          <Form.Item
            label="Thứ Tự Hiển Thị"
            name="thuTuHienThi"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <Input type="number" min={1} placeholder="1" />
          </Form.Item>

          <Form.Item
            label="Bắt Buộc"
            name="batBuoc"
            valuePropName="checked"
            rules={[{ required: true, message: 'Vui lòng chọn' }]}
          >
            <Select
              options={[
                { label: 'Có (Bắt buộc)', value: true },
                { label: 'Không (Tùy chọn)', value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
