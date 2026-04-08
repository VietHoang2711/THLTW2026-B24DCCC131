import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Upload, message, Tabs, Row, Col, Card } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { DEFAULT_DESTINATIONS } from '../../models/travel/destinations';

const storageKey = 'travel_destinations';
const plannerKey = 'travel_planner';

export default function Admin(): JSX.Element {
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setData(JSON.parse(raw));
    else {
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_DESTINATIONS));
      setData(DEFAULT_DESTINATIONS as any[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

  const save = async (values: any) => {
    if (values._imgFile && values._imgFile.file) {
      try {
        const b64 = await toBase64(values._imgFile.file.originFileObj);
        values.image = b64;
      } catch (e) {
        // ignore
      }
    }

    const processed = {
      ...values,
      price: Number(values.price || 0),
      rating: Number(values.rating || 0),
      durationMins: Number(values.durationMins || 0),
      costBreakdown: {
        food: Number(values.food || 0),
        transport: Number(values.transport || 0),
        lodging: Number(values.lodging || 0),
      },
    };

    if (editing) {
      const next = data.map((d) => (d.id === editing.id ? { ...d, ...processed } : d));
      setData(next);
      message.success('Đã cập nhật');
    } else {
      const item = { id: `d${Date.now()}`, ...processed };
      const next = [item, ...data];
      setData(next);
      message.success('Đã thêm');
    }
    setVisible(false);
    setEditing(null);
  };

  const remove = (id: string) => {
    const next = data.filter((d) => d.id !== id);
    setData(next);
    message.success('Đã xóa');
  };

  const columns = [
    { title: 'Tên', dataIndex: 'title', key: 'title', render: (t: any, r: any) => (<div><strong>{t}</strong><div style={{fontSize:12,color:'#666'}}>{r.type}</div></div>) },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (v: any) => `$${v}` },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
    { title: 'Thời gian (phút)', dataIndex: 'durationMins', key: 'durationMins' },
    {
      title: 'Hành động', key: 'actions', render: (_: any, record: any) => (
        <>
          <a onClick={() => { setEditing(record); setVisible(true); }}>Sửa</a>
          <span style={{ padding: '0 8px' }} />
          <a onClick={() => remove(record.id)}>Xóa</a>
        </>
      ),
    },
  ];

  // Statistics
  const stats = useMemo(() => {
    const raw = localStorage.getItem(plannerKey);
    const planner = raw ? JSON.parse(raw) : [];
    const monthly: Record<string, number> = {};
    const popular: Record<string, number> = {};
    const revenue = { food: 0, transport: 0, lodging: 0, activities: 0 };
    planner.forEach((d: any) => {
      if (d.date) {
        const month = d.date.slice(0,7);
        monthly[month] = (monthly[month] || 0) + 1;
      }
      (d.items || []).forEach((it: any) => {
        popular[it.title || it.name || it.id] = (popular[it.title || it.name || it.id] || 0) + 1;
        revenue.food += Number(it?.costBreakdown?.food || 0);
        revenue.transport += Number(it?.costBreakdown?.transport || 0);
        revenue.lodging += Number(it?.costBreakdown?.lodging || 0);
        revenue.activities += Number(it?.price || 0);
      });
    });
    const popularList = Object.entries(popular).map(([k,v]) => ({ title:k, count:v })).sort((a,b) => b.count - a.count);
    const months = Object.entries(monthly).sort((a,b) => a[0].localeCompare(b[0]));
    return { monthly: months, popular: popularList, revenue };
  }, [data]);

  const chartMonthlyOptions = { chart: { type: 'bar' }, xaxis: { categories: stats.monthly.map((m:any)=>m[0]) } };
  const chartMonthlySeries = [{ name: 'Lượt lịch', data: stats.monthly.map((m:any)=>m[1]) }];
  const chartRevenueOptions = { chart: { type: 'donut' }, labels: ['Ăn uống','Di chuyển','Lưu trú','Hoạt động'] };
  const chartRevenueSeries = [stats.revenue.food, stats.revenue.transport, stats.revenue.lodging, stats.revenue.activities];

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="manage">
        <Tabs.TabPane tab="Quản lý điểm đến" key="manage">
          <div style={{ marginBottom: 12 }}>
            <Button type="primary" onClick={() => { setEditing(null); setVisible(true); }} icon={<PlusOutlined />}>Thêm điểm đến</Button>
          </div>
          <Table dataSource={data} columns={columns} rowKey="id" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thống kê" key="stats">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card title="Lượt lịch theo tháng">
                <ReactApexChart options={chartMonthlyOptions as any} series={chartMonthlySeries as any} type="bar" height={240} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Doanh thu theo hạng mục">
                <ReactApexChart options={chartRevenueOptions as any} series={chartRevenueSeries as any} type="donut" height={240} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col xs={24} md={12}>
              <Card title="Địa điểm phổ biến">
                <Table dataSource={stats.popular} columns={[{title:'Địa điểm',dataIndex:'title'},{title:'Số lượt',dataIndex:'count'}]} pagination={false} rowKey={(r:any)=>r.title} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Tổng doanh thu">
                <div>Ăn uống: ${stats.revenue.food}</div>
                <div>Di chuyển: ${stats.revenue.transport}</div>
                <div>Lưu trú: ${stats.revenue.lodging}</div>
                <div>Hoạt động: ${stats.revenue.activities}</div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <Modal visible={visible} onCancel={() => { setVisible(false); setEditing(null); }} footer={null} title={editing ? 'Chỉnh sửa' : 'Thêm'}>
        <Form initialValues={editing || { type: 'city' }} onFinish={save} layout="vertical">
          <Form.Item name="title" label="Tên" rules={[{ required: true }] }>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="type" label="Loại">
            <Select>
              <Select.Option value="beach">Biển</Select.Option>
              <Select.Option value="mountain">Núi</Select.Option>
              <Select.Option value="city">Thành phố</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá">
            <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="durationMins" label="Thời gian tham quan (phút)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Chi phí (ăn/di chuyển/lưu trú)">
            <InputNumber name="food" placeholder="Ăn uống" min={0} style={{ width: '32%', marginRight: '2%' }} onChange={() => {}} />
            <InputNumber name="transport" placeholder="Di chuyển" min={0} style={{ width: '32%', marginRight: '2%' }} onChange={() => {}} />
            <InputNumber name="lodging" placeholder="Lưu trú" min={0} style={{ width: '32%' }} onChange={() => {}} />
          </Form.Item>
          <Form.Item name="_imgFile" label="Hình ảnh">
            <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
