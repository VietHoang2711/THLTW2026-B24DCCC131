import React, { useState } from 'react';
import './index.less';
import { Card, Table, Input, Select, DatePicker, Button, Modal, Form, InputNumber, Popconfirm, Tag } from 'antd';
import moment from 'moment';

type Session = {
	id: string;
	date: string;
	name: string;
	type: string;
	duration: number;
	calories: number;
	notes?: string;
	status: 'Completed' | 'Missed';
};

const initial: Session[] = [
	{
		id: '1',
		date: '2026-05-01',
		name: 'Morning Run',
		type: 'Cardio',
		duration: 30,
		calories: 250,
		status: 'Completed',
	},
	{
		id: '2',
		date: '2026-05-03',
		name: 'Upper Body',
		type: 'Strength',
		duration: 45,
		calories: 350,
		status: 'Completed',
	},
];

const WorkoutLog: React.FC = () => {
	const [data, setData] = useState<Session[]>(initial);
	const [filterName, setFilterName] = useState('');
	const [filterType, setFilterType] = useState<string | undefined>(undefined);
	const [range, setRange] = useState<any>(null);
	const [editing, setEditing] = useState<Session | null>(null);
	const [visible, setVisible] = useState(false);

	const columns = [
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Tên', dataIndex: 'name', key: 'name' },
		{ title: 'Loại', dataIndex: 'type', key: 'type' },
		{ title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration' },
		{ title: 'Calo', dataIndex: 'calories', key: 'calories' },
		{ title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (s: string) => <Tag color={s === 'Completed' ? 'green' : 'red'}>{s}</Tag>,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Session) => (
				<>
					<a
						onClick={() => {
							setEditing(record);
							setVisible(true);
						}}
					>
						Sửa
					</a>
					&nbsp;|&nbsp;
					<Popconfirm title='Xác nhận xóa?' onConfirm={() => setData((d) => d.filter((i) => i.id !== record.id))}>
						<a>Xóa</a>
					</Popconfirm>
				</>
			),
		},
	];

	const filtered = data.filter((d) => {
		if (filterName && !d.name.toLowerCase().includes(filterName.toLowerCase())) return false;
		if (filterType && d.type !== filterType) return false;
		if (range && range.length === 2) {
			const from = moment(range[0]).startOf('day');
			const to = moment(range[1]).endOf('day');
			const date = moment(d.date);
			if (!date.isBetween(from, to, undefined, '[]')) return false;
		}
		return true;
	});

	return (
		<Card title='Nhật ký tập luyện'>
			<div className='workout-controls'>
				<Input placeholder='Tìm theo tên' value={filterName} onChange={(e) => setFilterName(e.target.value)} />
				<Select allowClear placeholder='Loại' style={{ width: 160 }} onChange={(v) => setFilterType(v)}>
					<Select.Option value='Cardio'>Cardio</Select.Option>
					<Select.Option value='Strength'>Strength</Select.Option>
					<Select.Option value='Yoga'>Yoga</Select.Option>
					<Select.Option value='HIIT'>HIIT</Select.Option>
					<Select.Option value='Other'>Other</Select.Option>
				</Select>
				<DatePicker.RangePicker onChange={(r) => setRange(r)} />
				<Button
					type='primary'
					onClick={() => {
						setEditing(null);
						setVisible(true);
					}}
				>
					Thêm buổi tập
				</Button>
			</div>

			<Table dataSource={filtered} columns={columns} rowKey='id' />

			<Modal visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
				<Form
					initialValues={
						editing || {
							date: moment().format('YYYY-MM-DD'),
							type: 'Cardio',
							duration: 30,
							calories: 200,
							status: 'Completed',
						}
					}
					onFinish={(vals: any) => {
						const item: Session = {
							id: editing ? editing.id : String(Date.now()),
							date: vals.date && vals.date.format ? vals.date.format('YYYY-MM-DD') : vals.date,
							name: vals.name,
							type: vals.type,
							duration: vals.duration,
							calories: vals.calories,
							notes: vals.notes,
							status: vals.status,
						};
						setData((d) => (editing ? d.map((i) => (i.id === item.id ? item : i)) : [item, ...d]));
						setVisible(false);
					}}
				>
					<Form.Item name='date' label='Ngày'>
						<DatePicker />
					</Form.Item>
					<Form.Item name='name' label='Tên' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại'>
						<Select>
							<Select.Option value='Cardio'>Cardio</Select.Option>
							<Select.Option value='Strength'>Strength</Select.Option>
							<Select.Option value='Yoga'>Yoga</Select.Option>
							<Select.Option value='HIIT'>HIIT</Select.Option>
							<Select.Option value='Other'>Other</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name='duration' label='Thời lượng'>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item name='calories' label='Calo'>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item name='notes' label='Ghi chú'>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name='status' label='Trạng thái'>
						<Select>
							<Select.Option value='Completed'>Hoàn thành</Select.Option>
							<Select.Option value='Missed'>Bỏ lỡ</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default WorkoutLog;
