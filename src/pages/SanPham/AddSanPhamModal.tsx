import React from 'react';
import { Form, Input, InputNumber, Modal, ModalProps } from 'antd';
import { SanPham } from '@/models/sanpham';

interface AddSanPhamModalProps extends Omit<ModalProps, 'onOk'> {
  onOk: (values: Omit<SanPham, 'id'>) => void;
  loading?: boolean;
}

export const AddSanPhamModal: React.FC<AddSanPhamModalProps> = ({
  onOk,
  loading = false,
  ...modalProps
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    modalProps.onCancel?.({} as any);
  };

  return (
    <Modal
      title="Thêm Sản phẩm"
      okText="Thêm mới"
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      {...modalProps}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên sản phẩm',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá',
            },
            {
              type: 'number',
              min: 1,
              message: 'Giá phải là số dương',
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập giá"
            style={{ width: '100%' }}
            min={1}
            formatter={(value) => {
              if (!value) return '';
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số lượng',
            },
            {
              type: 'number',
              min: 1,
              message: 'Số lượng phải là số nguyên dương',
            },
            {
              pattern: /^[0-9]+$/,
              message: 'Số lượng phải là số nguyên',
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số lượng"
            style={{ width: '100%' }}
            min={1}
            step={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
