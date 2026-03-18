import React from 'react';
import { Table, Tag, Space, Button, Modal, Form, Input, TimePicker, message, Select } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { NhanVien, LichLamViec } from '@/models/dichvu';
import dayjs from 'dayjs';

interface LichLamViecEditorProps {
  nhanVien: NhanVien;
  onUpdate?: (lichLamViec: Map<number, LichLamViec>) => void;
}

const thuOptions = [
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
  { label: 'Chủ nhật', value: 1 },
];

const loaiOptions = [
  { label: 'Thường', value: 'thuong' },
  { label: 'Ngày nghỉ', value: 'ngay_nghi' },
];

export default function LichLamViecEditor({ nhanVien, onUpdate }: LichLamViecEditorProps) {
  const [lichLamViecs, setLichLamViecs] = React.useState(Array.from(nhanVien.lichLamViec.values()));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingThu, setEditingThu] = React.useState<number | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Thứ',
      dataIndex: 'thu',
      key: 'thu',
      render: (thu: number) => thuOptions.find((o) => o.value === thu)?.label,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      key: 'thoiGianBatDau',
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      key: 'thoiGianKetThuc',
    },
    {
      title: 'Loại',
      dataIndex: 'loai',
      key: 'loai',
      render: (loai: string) => (
        <Tag color={loai === 'thuong' ? 'blue' : 'red'}>
          {loai === 'thuong' ? 'Thường' : 'Ngày nghỉ'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: LichLamViec) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                thu: record.thu,
                thoiGianBatDau: dayjs(record.thoiGianBatDau, 'HH:mm'),
                thoiGianKetThuc: dayjs(record.thoiGianKetThuc, 'HH:mm'),
                loai: record.loai,
              });
              setEditingThu(record.thu);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              const updated = lichLamViecs.filter((l) => l.thu !== record.thu);
              setLichLamViecs(updated);
              const newMap = new Map(updated.map((l) => [l.thu, l]));
              onUpdate?.(newMap);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    const newLichLamViec: LichLamViec = {
      thu: values.thu,
      thoiGianBatDau: values.thoiGianBatDau.format('HH:mm'),
      thoiGianKetThuc: values.thoiGianKetThuc.format('HH:mm'),
      loai: values.loai,
    };

    let updated: LichLamViec[];
    if (editingThu !== null) {
      updated = lichLamViecs.map((l) => (l.thu === editingThu ? newLichLamViec : l));
    } else {
      updated = [...lichLamViecs, newLichLamViec];
    }

    setLichLamViecs(updated);
    const newMap = new Map(updated.map((l) => [l.thu, l]));
    onUpdate?.(newMap);

    setIsModalOpen(false);
    form.resetFields();
    setEditingThu(null);
    message.success('Cập nhật lịch làm việc thành công');
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => {
            setEditingThu(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm lịch làm việc
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={lichLamViecs}
        rowKey="thu"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingThu ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc'}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingThu(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Thứ"
            name="thu"
            rules={[{ required: true, message: 'Vui lòng chọn thứ' }]}
          >
            <Select options={thuOptions} disabled={editingThu !== null} />
          </Form.Item>

          <Form.Item
            label="Thời gian bắt đầu"
            name="thoiGianBatDau"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Thời gian kết thúc"
            name="thoiGianKetThuc"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item label="Loại" name="loai" initialValue="thuong">
            <Select options={loaiOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
