import React, { useMemo } from 'react';
import { Form, Input, InputNumber, Modal, ModalProps, Select, Row, Col, Card, Empty } from 'antd';
import { SanPham } from '@/models/sanpham';
import { DeleteOutlined } from '@ant-design/icons';

interface CreateDonHangModalProps extends Omit<ModalProps, 'onOk'> {
  products: SanPham[];
  onOk: (values: any) => void;
}

const phoneRegex = /^(0\d{9}|0\d{10})$/;

export const CreateDonHangModal: React.FC<CreateDonHangModalProps> = ({
  products,
  onOk,
  ...modalProps
}) => {
  const [form] = Form.useForm();

  const selectedProducts = Form.useWatch('products', form) || [];

  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((sum: number, productId: number) => {
      const product = products.find(p => p.id === productId);
      const quantity = form.getFieldValue(['quantity', productId]) || 0;
      return sum + (product?.price || 0) * quantity;
    }, 0);
  }, [selectedProducts, products, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate that at least one product is selected
      if (!values.products || values.products.length === 0) {
        form.setFields([{
          name: 'products',
          errors: ['Vui lòng chọn ít nhất một sản phẩm']
        }]);
        return;
      }

      // Validate quantities
      for (const productId of values.products) {
        const product = products.find(p => p.id === productId);
        const quantity = values[`quantity_${productId}`];
        if (!quantity || quantity < 1) {
          form.setFields([{
            name: ['quantity', productId],
            errors: ['Vui lòng nhập số lượng > 0']
          }]);
          return;
        }
        if (quantity > product!.quantity) {
          form.setFields([{
            name: ['quantity', productId],
            errors: [`Không được vượt quá ${product!.quantity} cái`]
          }]);
          return;
        }
      }

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

  const handleRemoveProduct = (productId: number) => {
    const current = form.getFieldValue('products') || [];
    form.setFieldValue('products', current.filter((id: number) => id !== productId));
  };

  return (
    <Modal
      title="Tạo Đơn hàng"
      okText="Tạo"
      cancelText="Hủy"
      onOk={handleOk}
      onCancel={handleCancel}
      {...modalProps}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        {/* Customer Info */}
        <Form.Item
          label="Tên khách hàng"
          name="customerName"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên khách hàng',
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại',
            },
            {
              pattern: phoneRegex,
              message: 'Số điện thoại phải là 10-11 chữ số bắt đầu bằng 0',
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại (0...)" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ',
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
        </Form.Item>

        {/* Products */}
        <Form.Item
          label="Chọn sản phẩm"
          name="products"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ít nhất một sản phẩm',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm"
            options={products
              .filter(p => p.quantity > 0)
              .map(p => ({
                label: `${p.name} (Còn: ${p.quantity})`,
                value: p.id
              }))}
          />
        </Form.Item>

        {/* Product Quantities */}
        {selectedProducts.length > 0 && (
          <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
            <h4 style={{ marginBottom: 16 }}>Nhập số lượng sản phẩm</h4>
            {selectedProducts.map((productId: number) => {
              const product = products.find(p => p.id === productId);
              return (
                <div key={productId} style={{ marginBottom: 12, padding: 12, backgroundColor: '#fff', borderRadius: 4 }}>
                  <Row gutter={16} align="middle">
                    <Col xs={24} sm={14}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{product?.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        Giá: {product?.price.toLocaleString('vi-VN')}đ | Còn: {product?.quantity}
                      </div>
                    </Col>
                    <Col xs={16} sm={8}>
                      <Form.Item
                        name={['quantity', productId]}
                        rules={[
                          {
                            required: true,
                            message: 'Nhập số lượng',
                          },
                          {
                            type: 'number',
                            min: 1,
                            message: 'Số lượng >= 1',
                          },
                        ]}
                        noStyle
                      >
                        <InputNumber
                          min={1}
                          max={product?.quantity}
                          style={{ width: '100%' }}
                          placeholder="SL"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={2}>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(productId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff4d4f',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 18,
                        }}
                      >
                        <DeleteOutlined />
                      </button>
                    </Col>
                  </Row>
                </div>
              );
            })}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #d9d9d9' }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                Tổng tiền: <span style={{ color: '#1890ff' }}>
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </Card>
        )}

        {selectedProducts.length === 0 && (
          <Card style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
            <Empty description="Chọn sản phẩm để xem chi tiết" />
          </Card>
        )}
      </Form>
    </Modal>
  );
};
