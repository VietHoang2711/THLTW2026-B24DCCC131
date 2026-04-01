import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Input,
  Tag,
  Drawer,
  Form,
  Row,
  Col,
  Select,
  Checkbox,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  HistoryOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  getDonDangKyList,
  addDonDangKy,
  updateDonDangKy,
  deleteDonDangKy,
  approveDonDangKy,
  rejectDonDangKy,
  approveMultipleDonDangKy,
  rejectMultipleDonDangKy,
  getLichSuThaoTacByDonDangKy,
} from '@/services/CauLacBo';
import type { DonDangKyThanhVien, CauLacBo, LichSuThaoTac } from '@/models/caulacbo';
import ModalDonDangKy from './components/ModalDonDangKy';
import ModalLichSu from './components/ModalLichSu';

interface QuanLyDonDangKyProps {
  caulacbos: CauLacBo[];
}

const QuanLyDonDangKy: React.FC<QuanLyDonDangKyProps> = ({ caulacbos }) => {
  const [data, setData] = useState<DonDangKyThanhVien[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DonDangKyThanhVien | null>(null);
  const [showLichSu, setShowLichSu] = useState(false);
  const [selectedDonDangKyId, setSelectedDonDangKyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getDonDangKyList();
      setData(response?.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách đơn đăng ký');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handler = () => {
      loadData();
    };
    try {
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('donDangKy:changed', handler as EventListener);
      }
    } catch (e) {}
    return () => {
      try {
        if (typeof window !== 'undefined' && window.removeEventListener) {
          window.removeEventListener('donDangKy:changed', handler as EventListener);
        }
      } catch (e) {}
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDonDangKy(id);
      message.success('Xóa đơn đăng ký thành công');
      window.dispatchEvent(new Event('donDangKy:changed'));
      loadData();
    } catch (error) {
      message.error('Lỗi xóa đơn đăng ký');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveDonDangKy(id);
      message.success('Duyệt đơn thành công');
      window.dispatchEvent(new Event('donDangKy:changed'));
      loadData();
    } catch (error) {
      message.error('Lỗi duyệt đơn');
    }
  };

  const handleReject = (id: string) => {
    Modal.confirm({
      title: 'Từ chối đơn đăng ký',
      content: (
        <div>
          <p>Nhập lý do từ chối:</p>
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      ),
      okText: 'Từ chối',
      cancelText: 'Hủy',
      onOk: async () => {
        if (!rejectReason.trim()) {
          message.error('Vui lòng nhập lý do từ chối');
          return;
        }
        try {
          await rejectDonDangKy(id, rejectReason);
          message.success('Từ chối đơn thành công');
          window.dispatchEvent(new Event('donDangKy:changed'));
          setRejectReason('');
          loadData();
        } catch (error) {
          message.error('Lỗi từ chối đơn');
        }
      },
    });
  };

  const handleApproveMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn');
      return;
    }
    try {
      await approveMultipleDonDangKy(selectedRowKeys as string[]);
      message.success(`Duyệt ${selectedRowKeys.length} đơn thành công`);
      window.dispatchEvent(new Event('donDangKy:changed'));
      setSelectedRowKeys([]);
      loadData();
    } catch (error) {
      message.error('Lỗi duyệt đơn');
    }
  };

  const handleRejectMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn');
      return;
    }

    Modal.confirm({
      title: 'Từ chối nhiều đơn đăng ký',
      content: (
        <div>
          <p>Nhập lý do từ chối {selectedRowKeys.length} đơn:</p>
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      ),
      okText: 'Từ chối',
      cancelText: 'Hủy',
      onOk: async () => {
        if (!rejectReason.trim()) {
          message.error('Vui lòng nhập lý do từ chối');
          return;
        }
        try {
          await rejectMultipleDonDangKy(selectedRowKeys as string[], rejectReason);
          message.success(`Từ chối ${selectedRowKeys.length} đơn thành công`);
          window.dispatchEvent(new Event('donDangKy:changed'));
          setRejectReason('');
          setSelectedRowKeys([]);
          loadData();
        } catch (error) {
          message.error('Lỗi từ chối đơn');
        }
      },
    });
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.soDienThoai.includes(searchText);

    const matchStatus = filterStatus === '' || item.trangThai === filterStatus;

    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 130,
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
        const map: { [key: string]: string } = { nam: 'Nam', nu: 'Nữ', khac: 'Khác' };
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
      width: 120,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'caulacboId',
      key: 'caulacboId',
      width: 150,
      render: (id: string) => {
        const clb = caulacbos.find((c) => c.id === id);
        return clb?.tenCauLacBo || 'N/A';
      },
    },
    {
      title: 'Lý do đăng ký',
      dataIndex: 'lyDoDangKy',
      key: 'lyDoDangKy',
      width: 150,
      render: (text: string) => (
        <div
          style={{
            maxHeight: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 110,
      render: (status: string) => {
        const map: { [key: string]: any } = {
          pending: { color: 'orange', text: 'Chưa duyệt' },
          approved: { color: 'green', text: 'Đã duyệt' },
          rejected: { color: 'red', text: 'Từ chối' },
        };
        const config = map[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      fixed: 'right' as const,
      render: (_: any, record: DonDangKyThanhVien) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setEditingRecord(record);
              setShowModal(true);
            }}
          >
            Chi tiết
          </Button>
          {record.trangThai === 'pending' && (
            <>
              <Button
                type="primary"
                success
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            type="dashed"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => {
              setSelectedDonDangKyId(record.id);
              setShowLichSu(true);
            }}
          >
            Lịch sử
          </Button>
          <Popconfirm
            title="Xóa đơn đăng ký"
            description="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          placeholder="Lọc theo trạng thái"
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="pending">Chưa duyệt</Select.Option>
          <Select.Option value="approved">Đã duyệt</Select.Option>
          <Select.Option value="rejected">Từ chối</Select.Option>
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRecord(null);
            setShowModal(true);
          }}
        >
          Thêm mới
        </Button>

        {selectedRowKeys.length > 0 && (
          <>
            <Button
              type="primary"
              onClick={handleApproveMultiple}
            >
              Duyệt {selectedRowKeys.length} đơn
            </Button>
            <Button
              danger
              onClick={handleRejectMultiple}
            >
              Từ chối {selectedRowKeys.length} đơn
            </Button>
          </>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn đăng ký`,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (record: DonDangKyThanhVien) => ({
            disabled: record.trangThai !== 'pending',
          }),
        }}
      />

      <ModalDonDangKy
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingRecord(null);
        }}
        onSave={(item?: DonDangKyThanhVien | null) => {
            // Reload data to ensure the list is up to date
            loadData();
            setShowModal(false);
            setEditingRecord(null);
          }}
        initialValues={editingRecord}
        caulacbos={caulacbos}
      />

      <ModalLichSu
        visible={showLichSu}
        onCancel={() => {
          setShowLichSu(false);
          setSelectedDonDangKyId(null);
        }}
        donDangKyId={selectedDonDangKyId}
      />
    </div>
  );
};

export default QuanLyDonDangKy;
