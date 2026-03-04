import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, ModalProps, Select } from 'antd';
import { SanPham } from '@/models/sanpham';

interface EditSanPhamModalProps extends Omit<ModalProps, 'onOk'> {
  product: SanPham;
  onOk: (values: Omit<SanPham, 'id'>) => void;
  loading?: boolean;
}

const categories = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Phụ kiện'];

export const EditSanPhamModal: React.FC<EditSanPhamModalProps> = ({
  product,
  onOk,
  loading = false,
  ...modalProps
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
      });
    }
  }, [product, form]);

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
      title={`Sửa Sản phẩm: ${product.name}`}
      okText="Cập nhật"
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
          label="Danh mục"
          name="category"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn danh mục',
            },
          ]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={categories.map(cat => ({ label: cat, value: cat }))}
          />
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
              min: 0,
              message: 'Số lượng phải là số không âm',
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
            min={0}
            step={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
