import React, { useState } from 'react';
import {
	Card,
	Row,
	Col,
	Progress,
	Button,
	Drawer,
	Form,
	Input,
	Select,
	DatePicker,
	Popconfirm,
	InputNumber,
} from 'antd';
import './index.less';

type Goal = {
	id: string;
	title: string;
	type: string;
	target: number;
	current: number;
	deadline?: string;
	status: 'InProgress' | 'Achieved' | 'Cancelled';
};

const initial: Goal[] = [
	{ id: '1', title: 'Giảm 5kg', type: 'Giảm cân', target: 5, current: 1, deadline: '2026-06-30', status: 'InProgress' },
];

const Goals: React.FC = () => {
	const [data, setData] = useState<Goal[]>(initial);
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState<'All' | 'InProgress' | 'Achieved' | 'Cancelled'>('All');

	const filtered = data.filter((g) => (filter === 'All' ? true : g.status === filter));

	return (
		<div>
			<div className='goals-controls'>
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm mục tiêu
				</Button>
				<Select className='goals-filter' value={filter} onChange={(v) => setFilter(v)}>
					<Select.Option value='All'>Tất cả</Select.Option>
					<Select.Option value='InProgress'>Đang thực hiện</Select.Option>
					<Select.Option value='Achieved'>Đã đạt</Select.Option>
					<Select.Option value='Cancelled'>Đã hủy</Select.Option>
				</Select>
			</div>

			<Row gutter={[16, 16]}>
				{filtered.map((g) => (
					<Col span={8} key={g.id}>
						<Card>
							<h3>{g.title}</h3>
							<div>Loại: {g.type}</div>
							<div>Deadline: {g.deadline}</div>
							<div className='goals-progress'>
								<Progress percent={Math.min(100, Math.round((g.current / g.target) * 100))} />
							</div>
							<div className='goals-inline'>
								<InputNumber
									min={0}
									value={g.current}
									onChange={(v: any) =>
										setData((d) => d.map((it) => (it.id === g.id ? { ...it, current: Number(v) } : it)))
									}
								/>
								<Popconfirm title='Xóa mục tiêu?' onConfirm={() => setData((d) => d.filter((it) => it.id !== g.id))}>
									<Button danger> Xóa </Button>
								</Popconfirm>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<Drawer title='Thêm mục tiêu' visible={open} onClose={() => setOpen(false)}>
				<Form
					onFinish={(vals) => {
						const item: Goal = {
							id: String(Date.now()),
							title: vals.title,
							type: vals.type,
							target: vals.target,
							current: vals.current || 0,
							deadline: vals.deadline && vals.deadline.format ? vals.deadline.format('YYYY-MM-DD') : vals.deadline,
							status: 'InProgress',
						};
						setData((d) => [item, ...d]);
						setOpen(false);
					}}
				>
					<Form.Item name='title' label='Tên' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại'>
						<Select>
							<Select.Option value='Giảm cân'>Giảm cân</Select.Option>
							<Select.Option value='Tăng cơ'>Tăng cơ</Select.Option>
							<Select.Option value='Cải thiện sức bền'>Cải thiện sức bền</Select.Option>
							<Select.Option value='Khác'>Khác</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name='target' label='Giá trị mục tiêu'>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item name='current' label='Giá trị hiện tại'>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item name='deadline' label='Deadline'>
						<DatePicker />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default Goals;
