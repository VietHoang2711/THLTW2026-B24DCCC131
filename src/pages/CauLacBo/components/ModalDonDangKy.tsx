import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { addDonDangKy, updateDonDangKy } from '@/services/CauLacBo';
import type { DonDangKyThanhVien, CauLacBo } from '@/models/caulacbo';

interface ModalDonDangKyProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (item?: DonDangKyThanhVien | null) => Promise<void> | void;
  initialValues?: DonDangKyThanhVien | null;
  caulacbos: CauLacBo[];
}

const ModalDonDangKy: React.FC<ModalDonDangKyProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  caulacbos,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          hoTen: initialValues.hoTen,
          email: initialValues.email,
          soDienThoai: initialValues.soDienThoai,
          gioiTinh: initialValues.gioiTinh,
          diaChi: initialValues.diaChi,
          soTruong: initialValues.soTruong,
          caulacboId: initialValues.caulacboId,
          lyDoDangKy: initialValues.lyDoDangKy,
          ghiChu: initialValues.ghiChu,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const data = {
        hoTen: values.hoTen,
        email: values.email,
        soDienThoai: values.soDienThoai,
        gioiTinh: values.gioiTinh,
        diaChi: values.diaChi,
        soTruong: values.soTruong,
        caulacboId: values.caulacboId,
        lyDoDangKy: values.lyDoDangKy,
        ghiChu: values.ghiChu,
        trangThai: initialValues?.trangThai || 'pending',
      };

      if (initialValues?.id) {
        const response = await updateDonDangKy(initialValues.id, data);
        message.success('Cập nhật đơn đăng ký thành công');
        await onSave(response?.data || null);
      } else {
        const response = await addDonDangKy(data);
        message.success('Thêm đơn đăng ký thành công');
        await onSave(response?.data || null);
      }
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('donDangKy:changed'));
      // close modal after notifying parent
      onCancel();
    } catch (error) {
      message.error('Lỗi lưu đơn đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialValues?.id ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
      visible={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          {initialValues?.id ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="hoTen"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="soDienThoai"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="gioiTinh"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="nam">Nam</Select.Option>
            <Select.Option value="nu">Nữ</Select.Option>
            <Select.Option value="khac">Khác</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="diaChi"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="soTruong"
          label="Sở trường"
          rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
        >
          <Input placeholder="Nhập sở trường" />
        </Form.Item>

        <Form.Item
          name="caulacboId"
          label="Câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
        >
          <Select placeholder="Chọn câu lạc bộ">
            {caulacbos.map((clb) => (
              <Select.Option key={clb.id} value={clb.id}>
                {clb.tenCauLacBo}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="lyDoDangKy"
          label="Lý do đăng ký"
          rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập lý do đăng ký" />
        </Form.Item>

        <Form.Item
          name="ghiChu"
          label="Ghi chú"
        >
          <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDonDangKy;
