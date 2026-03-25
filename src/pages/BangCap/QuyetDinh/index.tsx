import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuyetDinhModel, QuyetDinh } from '@/models/bangcap';
import { useVanBangRegisterModel } from '@/models/bangcap';
import dayjs from 'dayjs';

export default function QuyetDinhPage() {
  const { quyetDinhs, addQuyetDinh, updateQuyetDinh, deleteQuyetDinh } = useQuyetDinhModel();
  const { registers } = useVanBangRegisterModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const registerOptions = useMemo(
    () => registers.map((reg) => ({ label: `${reg.soVanBang} (${reg.nam})`, value: reg.id })),
    [registers]
  );

  const columns = [
    {
      title: 'Số Quyết Định',
      dataIndex: 'soQD',
      key: 'soQD',
      width: 120,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Ngày Ban Hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trích Yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
      width: 250,
    },
    {
      title: 'Sổ Văn Bằng',
      dataIndex: 'vanBangRegisterId',
      key: 'vanBangRegisterId',
      width: 150,
      render: (registerId: string) => {
        const register = registers.find((r) => r.id === registerId);
        return register ? `${register.soVanBang} (${register.nam})` : 'N/A';
      },
    },
    {
      title: 'Số SV',
      dataIndex: 'soLuongSinhVien',
      key: 'soLuongSinhVien',
      width: 80,
      render: (count: number) => <strong>{count}</strong>,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 150,
      render: (_: any, record: QuyetDinh) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue({
                soQD: record.soQD,
                ngayBanHanh: dayjs(record.ngayBanHanh).format('YYYY-MM-DD'),
                trichYeu: record.trichYeu,
                vanBangRegisterId: record.vanBangRegisterId,
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa?"
            onConfirm={() => {
              deleteQuyetDinh(record.id);
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

  const handleAddQuyetDinh = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        updateQuyetDinh(editingId, {
          ...values,
          ngayBanHanh: dayjs(values.ngayBanHanh).toISOString(),
        });
        message.success('Cập nhật quyết định thành công');
      } else {
        addQuyetDinh({
          ...values,
          ngayBanHanh: dayjs(values.ngayBanHanh).toISOString(),
        });
        message.success('Thêm quyết định thành công');
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuyetDinh}>
          Tạo Quyết Định Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quyetDinhs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingId ? 'Chỉnh Sửa Quyết Định' : 'Tạo Quyết Định Mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Số Quyết Định"
            name="soQD"
            rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
          >
            <Input placeholder="Ví dụ: QĐ-2024-001" />
          </Form.Item>

          <Form.Item
            label="Ngày Ban Hành"
            name="ngayBanHanh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Trích Yếu"
            name="trichYeu"
            rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
          >
            <Input.TextArea rows={3} placeholder="Nội dung trích yếu quyết định" />
          </Form.Item>

          <Form.Item
            label="Sổ Văn Bằng"
            name="vanBangRegisterId"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <Select options={registerOptions} placeholder="Chọn sổ văn bằng" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
