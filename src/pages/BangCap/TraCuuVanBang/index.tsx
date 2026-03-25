import { useState, useMemo } from 'react';
import { Card, Form, Input, Button, Table, Empty, Space, Statistic, Row, Col, Tabs, DatePicker, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useVanBangModel, VanBang } from '@/models/bangcap';
import { useQuyetDinhModel, QuyetDinh } from '@/models/bangcap';
import { useVanBangLookupModel } from '@/models/bangcap';
import dayjs from 'dayjs';

export default function TraCuuVanBangPage() {
  const { vanBangs } = useVanBangModel();
  const { quyetDinhs } = useQuyetDinhModel();
  const { recordLookup, getLookupCountByQuyetDinh, getAllLookupStats } = useVanBangLookupModel();
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<VanBang[]>([]);
  const [selectedQuyetDinh, setSelectedQuyetDinh] = useState<QuyetDinh | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Form fields for search
  const [soHieuVanBang, setSoHieuVanBang] = useState<string>('');
  const [soVaoBang, setSoVaoBang] = useState<string>('');
  const [maSinhVien, setMaSinhVien] = useState<string>('');
  const [hoTen, setHoTen] = useState<string>('');
  const [ngaySinh, setNgaySinh] = useState<any>(null);

  // Calculate how many search params are filled
  const filledParams = useMemo(() => {
    let count = 0;
    if (soHieuVanBang.trim()) count++;
    if (soVaoBang.trim()) count++;
    if (maSinhVien.trim()) count++;
    if (hoTen.trim()) count++;
    if (ngaySinh) count++;
    return count;
  }, [soHieuVanBang, soVaoBang, maSinhVien, hoTen, ngaySinh]);

  const handleSearch = () => {
    if (filledParams < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
      return;
    }

    let results = [...vanBangs];

    // Filter berdasarkan criteria yang diisi
    if (soHieuVanBang.trim()) {
      results = results.filter((vb) => vb.soHieuVanBang.includes(soHieuVanBang.trim()));
    }

    if (soVaoBang.trim()) {
      const soVao = parseInt(soVaoBang.trim(), 10);
      if (!isNaN(soVao)) {
        results = results.filter((vb) => vb.soVaoBang === soVao);
      }
    }

    if (maSinhVien.trim()) {
      results = results.filter((vb) => vb.maSinhVien.includes(maSinhVien.trim()));
    }

    if (hoTen.trim()) {
      results = results.filter((vb) =>
        vb.hoTen.toLowerCase().includes(hoTen.trim().toLowerCase())
      );
    }

    if (ngaySinh) {
      const selectedNgay = dayjs(ngaySinh).format('YYYY-MM-DD');
      results = results.filter((vb) =>
        dayjs(vb.ngaySinh).format('YYYY-MM-DD') === selectedNgay
      );
    }

    setSearchResults(results);
    setHasSearched(true);

    // Record lookup for each quyết định that was found
    if (results.length > 0) {
      const uniqueQDs = new Set(results.map((r) => r.quyetDinhId));
      uniqueQDs.forEach((qdId) => {
        recordLookup(qdId);
      });
    }
  };

  const handleViewDetail = (vanBang: VanBang) => {
    const qd = quyetDinhs.find((q) => q.id === vanBang.quyetDinhId);
    if (qd) {
      setSelectedQuyetDinh(qd);
      recordLookup(qd.id);
    }
  };

  const columns = [
    {
      title: 'Số Vào Sổ',
      dataIndex: 'soVaoBang',
      key: 'soVaoBang',
      width: 100,
    },
    {
      title: 'Số Hiệu Văn Bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 130,
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 120,
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
      title: 'Hành Động',
      key: 'action',
      width: 100,
      render: (_: any, record: VanBang) => (
        <Button
          type="text"
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          Chi Tiết
        </Button>
      ),
    },
  ];

  const lookupStats = getAllLookupStats();
  const statsData = quyetDinhs.map((qd) => ({
    soQD: qd.soQD,
    trichYeu: qd.trichYeu,
    soLuotTraCuu: getLookupCountByQuyetDinh(qd.id),
  }));

  return (
    <div>
      <Card title="Tra Cứu Văn Bằng" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Số Hiệu Văn Bằng">
                <Input
                  placeholder="Nhập số hiệu văn bằng"
                  value={soHieuVanBang}
                  onChange={(e) => setSoHieuVanBang(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Số Vào Sổ">
                <Input
                  type="number"
                  placeholder="Nhập số vào sổ"
                  value={soVaoBang}
                  onChange={(e) => setSoVaoBang(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mã Sinh Viên">
                <Input
                  placeholder="Nhập mã sinh viên"
                  value={maSinhVien}
                  onChange={(e) => setMaSinhVien(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Họ Tên">
                <Input
                  placeholder="Nhập họ tên"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ngày Sinh">
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  value={ngaySinh}
                  onChange={(date) => setNgaySinh(date)}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                block
                onClick={handleSearch}
              >
                Tra Cứu ({filledParams || 0}/5)
              </Button>
            </Col>
          </Row>

          <div style={{ color: '#999', fontSize: 12 }}>
            * Vui lòng nhập ít nhất 2 tham số để tìm kiếm
          </div>
        </Form>
      </Card>

      {hasSearched && (
        <Tabs
          items={[
            {
              key: 'results',
              label: `Kết Quả Tìm Kiếm (${searchResults.length})`,
              children: (
                <>
                  {searchResults.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={searchResults}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: 800 }}
                    />
                  ) : (
                    <Empty description="Không tìm thấy kết quả" />
                  )}
                </>
              ),
            },
            {
              key: 'stats',
              label: 'Thống Kê Tra Cứu',
              children: (
                <Table
                  columns={[
                    { title: 'Số Quyết Định', dataIndex: 'soQD', key: 'soQD', width: 150 },
                    { title: 'Trích Yếu', dataIndex: 'trichYeu', key: 'trichYeu', flex: 1 },
                    {
                      title: 'Số Lượt Tra Cứu',
                      dataIndex: 'soLuotTraCuu',
                      key: 'soLuotTraCuu',
                      width: 150,
                      render: (count: number) => <strong>{count}</strong>,
                    },
                  ]}
                  dataSource={statsData}
                  rowKey="soQD"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      )}

      {selectedQuyetDinh && (
        <Card
          title={`Chi Tiết Quyết Định: ${selectedQuyetDinh.soQD}`}
          style={{ marginTop: 24 }}
          extra={
            <Button onClick={() => setSelectedQuyetDinh(null)}>
              Đóng
            </Button>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Statistic label="Số Quyết Định" value={selectedQuyetDinh.soQD} />
            </Col>
            <Col span={12}>
              <Statistic label="Ngày Ban Hành" value={dayjs(selectedQuyetDinh.ngayBanHanh).format('DD/MM/YYYY')} />
            </Col>
          </Row>
          <div style={{ marginTop: 16 }}>
            <strong>Trích Yếu:</strong>
            <p>{selectedQuyetDinh.trichYeu}</p>
          </div>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Statistic
                label="Số Sinh Viên"
                value={selectedQuyetDinh.soLuongSinhVien}
              />
            </Col>
            <Col span={12}>
              <Statistic
                label="Tổng Lượt Tra Cứu"
                value={getLookupCountByQuyetDinh(selectedQuyetDinh.id)}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}
