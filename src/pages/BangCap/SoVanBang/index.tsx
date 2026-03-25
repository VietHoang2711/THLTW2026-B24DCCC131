import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useVanBangRegisterModel, VanBangRegister } from '@/models/bangcap';
import dayjs from 'dayjs';

export default function SoVanBangPage() {
  const { registers, addRegister, updateRegister, closeRegister } = useVanBangRegisterModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Năm',
      dataIndex: 'nam',
      key: 'nam',
      width: 100,
      render: (text: number) => <strong>{text}</strong>,
    },
    {
      title: 'Số Văn Bằng',
      dataIndex: 'soVanBang',
      key: 'soVanBang',
      width: 120,
    },
    {
      title: 'Ngày Mở',
      dataIndex: 'ngayMo',
      key: 'ngayMo',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'mo' ? 'green' : 'red'}>
          {status === 'mo' ? 'Mở' : 'Đóng'}
        </Tag>
      ),
    },
    {
      title: 'Số Lượng Văn Bằng',
      dataIndex: 'soLuongVanBang',
      key: 'soLuongVanBang',
      width: 150,
      render: (count: number) => <strong>{count}</strong>,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 120,
      render: (_: any, record: VanBangRegister) => (
        <Space>
          {record.trangThai === 'mo' && (
            <>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingId(record.id);
                  setIsModalOpen(true);
                  form.setFieldsValue({
                    nam: record.nam,
                    soVanBang: record.soVanBang,
                  });
                }}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Xác nhận"
                description="Bạn chắc chắn muốn đóng sổ này?"
                onConfirm={() => {
                  closeRegister(record.id);
                  message.success('Đóng sổ thành công');
                }}
              >
                <Button type="text" danger size="small">
                  Đóng Sổ
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleAddRegister = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        updateRegister(editingId, {
          ...values,
          ngayMo: dayjs(values.ngayMo).toISOString(),
        });
        message.success('Cập nhật sổ văn bằng thành công');
      } else {
        addRegister({
          ...values,
          ngayMo: dayjs(values.ngayMo).toISOString(),
          trangThai: 'mo',
        });
        message.success('Thêm sổ văn bằng thành công');
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRegister}>
          Tạo Sổ Văn Bằng Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={registers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingId ? 'Chỉnh Sửa Sổ Văn Bằng' : 'Tạo Sổ Văn Bằng Mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Năm"
            name="nam"
            rules={[
              { required: true, message: 'Vui lòng nhập năm' },
              { pattern: /^\d{4}$/, message: 'Năm phải là 4 chữ số' },
            ]}
          >
            <Input type="number" min={2000} max={2099} />
          </Form.Item>

          <Form.Item
            label="Số Văn Bằng"
            name="soVanBang"
            rules={[{ required: true, message: 'Vui lòng nhập số văn bằng' }]}
          >
            <Input placeholder="Ví dụ: 2024-001" />
          </Form.Item>

          <Form.Item
            label="Ngày Mở"
            name="ngayMo"
            rules={[{ required: true, message: 'Vui lòng chọn ngày mở' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
