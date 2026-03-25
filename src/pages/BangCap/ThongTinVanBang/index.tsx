import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Card, Row, Col, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useVanBangModel, VanBang } from '@/models/bangcap';
import { useQuyetDinhModel } from '@/models/bangcap';
import { useVanBangRegisterModel } from '@/models/bangcap';
import { useFormConfigModel } from '@/models/bangcap';
import dayjs from 'dayjs';

export default function ThongTinVanBangPage() {
  const { vanBangs, addVanBang, updateVanBang, deleteVanBang } = useVanBangModel();
  const { quyetDinhs } = useQuyetDinhModel();
  const { registers } = useVanBangRegisterModel();
  const { configs } = useFormConfigModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const quyetDinhOptions = useMemo(
    () => quyetDinhs.map((qd) => ({ label: `${qd.soQD} - ${qd.trichYeu}`, value: qd.id })),
    [quyetDinhs]
  );

  const registerOptions = useMemo(
    () => registers.map((reg) => ({ label: `${reg.soVanBang} (${reg.nam})`, value: reg.id })),
    [registers]
  );

  const baseColumns = [
    {
      title: 'Số Vào Sổ',
      dataIndex: 'soVaoBang',
      key: 'soVaoBang',
      width: 100,
      render: (text: number) => <strong>{text}</strong>,
    },
    {
      title: 'Số Hiệu Văn Bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 130,
    },
    {
      title: 'MSV',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 100,
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 150,
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết Định',
      dataIndex: 'quyetDinhId',
      key: 'quyetDinhId',
      width: 150,
      render: (qdId: string) => {
        const qd = quyetDinhs.find((q) => q.id === qdId);
        return qd ? qd.soQD : 'N/A';
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: VanBang) => (
        <Space>
          {record.soVaoBang !== record.soVaoBang && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingId(record.id);
                setIsModalOpen(true);
                form.setFieldsValue({
                  soHieuVanBang: record.soHieuVanBang,
                  maSinhVien: record.maSinhVien,
                  hoTen: record.hoTen,
                  ngaySinh: dayjs(record.ngaySinh),
                  quyetDinhId: record.quyetDinhId,
                  vanBangRegisterId: record.vanBangRegisterId,
                  ...record.chuThichThemTheoForm,
                });
              }}
            >
              Sửa
            </Button>
          )}
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa?"
            onConfirm={() => {
              deleteVanBang(record.id);
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

  const additionalColumns = configs.map((config) => ({
    title: config.tenTruong,
    dataIndex: ['chuThichThemTheoForm', config.id],
    key: config.id,
    width: 150,
    render: (value: any) => {
      if (!value) return '-';
      if (config.kieuDuLieu === 'date') {
        return dayjs(value).format('DD/MM/YYYY');
      }
      return value;
    },
  }));

  const columns = [...baseColumns, ...additionalColumns];

  const handleAddVanBang = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { soHieuVanBang, maSinhVien, hoTen, ngaySinh, quyetDinhId, vanBangRegisterId, ...thongTinThem } = values;

      const chuThichThemTheoForm: Record<string, any> = {};
      configs.forEach((config) => {
        if (thongTinThem[config.id] !== undefined) {
          chuThichThemTheoForm[config.id] = thongTinThem[config.id];
        }
      });

      const vb = {
        soHieuVanBang,
        maSinhVien,
        hoTen,
        ngaySinh: dayjs(ngaySinh).toISOString(),
        quyetDinhId,
        vanBangRegisterId,
        chuThichThemTheoForm,
      };

      if (editingId) {
        updateVanBang(editingId, vb);
        message.success('Cập nhật văn bằng thành công');
      } else {
        addVanBang(vb as any, vanBangRegisterId);
        message.success('Thêm văn bằng thành công');
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVanBang}>
          Thêm Văn Bằng Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={vanBangs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? 'Chỉnh Sửa Thông Tin Văn Bằng' : 'Tạo Thông Tin Văn Bằng Mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số Hiệu Văn Bằng"
                name="soHieuVanBang"
                rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
              >
                <Input placeholder="2024-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã Sinh Viên"
                name="maSinhVien"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
              >
                <Input placeholder="SV001" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Họ Tên"
            name="hoTen"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày Sinh"
                name="ngaySinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sổ Văn Bằng"
                name="vanBangRegisterId"
                rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
              >
                <Select options={registerOptions} placeholder="Chọn sổ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Quyết Định Tốt Nghiệp"
            name="quyetDinhId"
            rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
          >
            <Select options={quyetDinhOptions} placeholder="Chọn quyết định" />
          </Form.Item>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 16 }}>
            <h4>Thông Tin Bổ Sung</h4>
            {configs.map((config) => (
              <Form.Item
                key={config.id}
                label={config.tenTruong}
                name={config.id}
                rules={
                  config.batBuoc
                    ? [{ required: true, message: `Vui lòng nhập ${config.tenTruong.toLowerCase()}` }]
                    : []
                }
              >
                {config.kieuDuLieu === 'string' && <Input />}
                {config.kieuDuLieu === 'number' && <InputNumber style={{ width: '100%' }} />}
                {config.kieuDuLieu === 'date' && <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>
    </Card>
  );
}
