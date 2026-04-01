import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, message, Spin, Empty, Tag } from 'antd';
import { getLichSuThaoTacByDonDangKy } from '@/services/CauLacBo';
import type { LichSuThaoTac } from '@/models/caulacbo';

interface ModalLichSuProps {
  visible: boolean;
  onCancel: () => void;
  donDangKyId?: string | null;
}

const ModalLichSu: React.FC<ModalLichSuProps> = ({
  visible,
  onCancel,
  donDangKyId,
}) => {
  const [lichSu, setLichSu] = useState<LichSuThaoTac[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && donDangKyId) {
      loadLichSu();
    }
  }, [visible, donDangKyId]);

  const loadLichSu = async () => {
    setLoading(true);
    try {
      const response = await getLichSuThaoTacByDonDangKy(donDangKyId!);
      setLichSu(response?.data || []);
    } catch (error) {
      message.error('Lỗi tải lịch sử');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Hành động',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      width: 100,
      render: (action: string) => {
        const map: { [key: string]: any } = {
          approved: { color: 'green', text: 'Duyệt' },
          rejected: { color: 'red', text: 'Từ chối' },
        };
        const config = map[action] || { color: 'default', text: action };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Người thao tác',
      dataIndex: 'nguoiThaoTac',
      key: 'nguoiThaoTac',
      width: 150,
    },
    {
      title: 'Thời điểm',
      dataIndex: 'thoiDiem',
      key: 'thoiDiem',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('vi-VN'),
    },
    {
      title: 'Lý do',
      dataIndex: 'lyDo',
      key: 'lyDo',
      width: 250,
      render: (text: string) => text || '-',
    },
  ];

  return (
    <Modal
      title="Lịch sử thao tác"
      visible={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {lichSu.length === 0 ? (
          <Empty description="Không có lịch sử thao tác" />
        ) : (
          <Table
            columns={columns}
            dataSource={lichSu}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} thao tác`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default ModalLichSu;
