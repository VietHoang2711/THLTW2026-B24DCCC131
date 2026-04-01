import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, Checkbox, message } from 'antd';
import { addCauLacBo, updateCauLacBo } from '@/services/CauLacBo';
import { buildUpLoadFile, EFileScope } from '@/services/uploadFile';
import type { CauLacBo } from '@/models/caulacbo';
import { UploadOutlined } from '@ant-design/icons';

interface ModalCauLacBoProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (item?: CauLacBo | null) => Promise<void> | void;
  initialValues?: CauLacBo | null;
}

const ModalCauLacBo: React.FC<ModalCauLacBoProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          tenCauLacBo: initialValues.tenCauLacBo,
          chuNhiemCLB: initialValues.chuNhiemCLB,
          ngayThanhLap: initialValues.ngayThanhLap?.split('T')[0],
          hoatDong: initialValues.hoatDong,
          anhDaiDien: initialValues.anhDaiDien
            ? {
                url: initialValues.anhDaiDien,
                fileList: [{ url: initialValues.anhDaiDien }],
              }
            : undefined,
        });
        setEditorContent(initialValues.moTa || '');
      } else {
        form.resetFields();
        setEditorContent('');
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log('Form values:', values);

      // Upload ảnh nếu có
      let anhUrl = initialValues?.anhDaiDien || '';
      if (values.anhDaiDien?.fileList?.[0]?.originFileObj) {
        try {
          console.log('Uploading image...');
          const uploadedUrl = await buildUpLoadFile(values, 'anhDaiDien', EFileScope.PUBLIC);
          if (uploadedUrl) {
            anhUrl = uploadedUrl;
            console.log('Image uploaded:', anhUrl);
          }
        } catch (err) {
          console.log('Upload ảnh thất bại, tiếp tục mà không ảnh:', err);
        }
      }

      const data = {
        tenCauLacBo: values.tenCauLacBo,
        chuNhiemCLB: values.chuNhiemCLB,
        ngayThanhLap: values.ngayThanhLap,
        moTa: editorContent || '',
        hoatDong: values.hoatDong || false,
        anhDaiDien: anhUrl || '',
        trangThai: values.hoatDong ? 'active' : 'inactive',
      };

      console.log('Sending data:', data);

      if (initialValues?.id) {
        console.log('Updating club:', initialValues.id);
        const response = await updateCauLacBo(initialValues.id, data);
        console.log('Updated club response:', response);
        message.success('Cập nhật câu lạc bộ thành công');
        // Pass updated item back to parent
        await onSave(response?.data || null);
        form.resetFields();
        setEditorContent('');
        return;
      } else {
        console.log('Creating new club');
        const response = await addCauLacBo(data);
        console.log('Created club response:', response);
        message.success('Thêm câu lạc bộ thành công');
        // Pass created item back to parent
        await onSave(response?.data || null);
        form.resetFields();
        setEditorContent('');
        return;
      }
      
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Lỗi lưu câu lạc bộ';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialValues?.id ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm Câu lạc bộ mới'}
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
          name="tenCauLacBo"
          label="Tên Câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
        >
          <Input placeholder="Nhập tên câu lạc bộ" />
        </Form.Item>

        <Form.Item
          name="chuNhiemCLB"
          label="Chủ nhiệm CLB"
          rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}
        >
          <Input placeholder="Nhập tên chủ nhiệm" />
        </Form.Item>

        <Form.Item
          name="ngayThanhLap"
          label="Ngày thành lập"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="anhDaiDien"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            maxCount={1}
            accept="image/*"
            beforeUpload={() => false}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Mô tả (HTML)">
          <Input.TextArea
            rows={5}
            placeholder="Nhập mô tả câu lạc bộ (hỗ trợ HTML)"
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="hoatDong" valuePropName="checked">
          <Checkbox>Hoạt động</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCauLacBo;
