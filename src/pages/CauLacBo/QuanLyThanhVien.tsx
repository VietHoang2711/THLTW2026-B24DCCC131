import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Input,
  Select,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import {
  getDonDangKyList,
  changeThanhVienCauLacBo,
} from '@/services/CauLacBo';
import type { DonDangKyThanhVien, CauLacBo } from '@/models/caulacbo';

interface QuanLyThanhVienProps {
  caulacbos: CauLacBo[];
}

const QuanLyThanhVien: React.FC<QuanLyThanhVienProps> = ({ caulacbos }) => {
  const [data, setData] = useState<DonDangKyThanhVien[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCauLacBo, setFilterCauLacBo] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedCauLacBoSau, setSelectedCauLacBoSau] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getDonDangKyList();
      // Filter only approved members
      const approved = (response?.data || []).filter(
        (item: DonDangKyThanhVien) => item.trangThai === 'approved'
      );
      setData(approved);
    } catch (error) {
      message.error('Lỗi tải danh sách thành viên');
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

  const handleChangeClub = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thành viên');
      return;
    }

    if (!selectedCauLacBoSau) {
      message.warning('Vui lòng chọn câu lạc bộ đích');
      return;
    }

    const targetClub = caulacbos.find((c) => c.id === selectedCauLacBoSau);

    Modal.confirm({
      title: 'Chuyển câu lạc bộ',
      content: `Bạn chắc chắn muốn chuyển ${selectedRowKeys.length} thành viên sang câu lạc bộ: ${targetClub?.tenCauLacBo}?`,
      okText: 'Chuyển',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await changeThanhVienCauLacBo(
            selectedRowKeys as string[],
            selectedCauLacBoSau
          );
          message.success(
            `Chuyển ${selectedRowKeys.length} thành viên thành công`
          );
          window.dispatchEvent(new Event('donDangKy:changed'));
          setSelectedRowKeys([]);
          setSelectedCauLacBoSau('');
          loadData();
        } catch (error) {
          message.error('Lỗi chuyển câu lạc bộ');
        }
      },
    });
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.soDienThoai.includes(searchText);

    const matchCauLacBo =
      filterCauLacBo === '' || item.caulacboId === filterCauLacBo;

    return matchSearch && matchCauLacBo;
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
        return (
          <Tag color="blue">{clb?.tenCauLacBo || 'N/A'}</Tag>
        );
      },
    },
    {
      title: 'Ngày dăng ký',
      dataIndex: 'ngayDangKy',
      key: 'ngayDangKy',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          placeholder="Lọc theo câu lạc bộ"
          value={filterCauLacBo}
          onChange={setFilterCauLacBo}
          style={{ width: 200 }}
          allowClear
        >
          {caulacbos.map((clb) => (
            <Select.Option key={clb.id} value={clb.id}>
              {clb.tenCauLacBo}
            </Select.Option>
          ))}
        </Select>

        {selectedRowKeys.length > 0 && (
          <>
            <Select
              placeholder="Chọn câu lạc bộ đích"
              value={selectedCauLacBoSau}
              onChange={setSelectedCauLacBoSau}
              style={{ width: 200 }}
              allowClear
            >
              {caulacbos.map((clb) => (
                <Select.Option key={clb.id} value={clb.id}>
                  {clb.tenCauLacBo}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={handleChangeClub}
            >
              Chuyển {selectedRowKeys.length} thành viên
            </Button>
          </>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} thành viên`,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />
    </div>
  );
};

export default QuanLyThanhVien;
