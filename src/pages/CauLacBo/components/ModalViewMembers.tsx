import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Space, message, Spin, Empty } from 'antd';
import { getThanhVienByCauLacBo } from '@/services/CauLacBo';
import type { DonDangKyThanhVien } from '@/models/caulacbo';

interface ModalViewMembersProps {
  visible: boolean;
  onCancel: () => void;
  caulacboId?: string | null;
}

const ModalViewMembers: React.FC<ModalViewMembersProps> = ({
  visible,
  onCancel,
  caulacboId,
}) => {
  const [members, setMembers] = useState<DonDangKyThanhVien[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && caulacboId) {
      loadMembers();
    }
  }, [visible, caulacboId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await getThanhVienByCauLacBo(caulacboId!);
      setMembers(response?.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 120,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      width: 80,
      render: (gt: string) => {
        const map: { [key: string]: string } = {
          nam: 'Nam',
          nu: 'Nữ',
          khac: 'Khác',
        };
        return map[gt] || gt;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 150,
    },
    {
      title: 'Sở trường',
      dataIndex: 'soTruong',
      key: 'soTruong',
      width: 150,
    },
  ];

  return (
    <Modal
      title="Danh sách thành viên câu lạc bộ"
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {members.length === 0 ? (
          <Empty description="Không có thành viên" />
        ) : (
          <Table
            columns={columns}
            dataSource={members}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} thành viên`,
            }}
            scroll={{ x: 900 }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ModalViewMembers;
