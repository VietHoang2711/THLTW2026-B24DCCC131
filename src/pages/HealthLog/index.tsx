import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, InputNumber, DatePicker, Popconfirm, Tag } from 'antd';
import './index.less';
import moment from 'moment';

type Health = {
	id: string;
	date: string;
	weight: number; // kg
	height: number; // cm
	restingHr: number;
	sleepTime: string;
};

const initial: Health[] = [
	{ id: '1', date: '2026-05-01', weight: 70, height: 175, restingHr: 60, sleepTime: '22:30' },
	{ id: '2', date: '2026-05-10', weight: 69, height: 175, restingHr: 58, sleepTime: '23:00' },
];

const calcBMI = (w: number, hCm: number) => {
	const h = hCm / 100;
	if (!h) return 0;
	return +(w / (h * h));
};

const bmiTag = (bmi: number) => {
	if (bmi < 18.5) return <Tag color='blue'>Thiếu cân</Tag>;
	if (bmi < 25) return <Tag color='green'>Bình thường</Tag>;
	if (bmi < 30) return <Tag color='gold'>Thừa cân</Tag>;
	return <Tag color='red'>Béo phì</Tag>;
};

const HealthLog: React.FC = () => {
	const [data, setData] = useState<Health[]>(initial);
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<Health | null>(null);

	const columns = [
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
		{ title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
		{
			title: 'BMI',
			key: 'bmi',
			render: (_: any, rec: Health) => {
				const bmi = calcBMI(rec.weight, rec.height);
				return (
					<div>
						{bmi.toFixed(1)} {bmiTag(bmi)}
					</div>
				);
			},
		},
		{ title: 'Nhịp tim lúc nghỉ (bpm)', dataIndex: 'restingHr', key: 'restingHr' },
		{ title: 'Giờ ngủ', dataIndex: 'sleepTime', key: 'sleepTime' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, rec: Health) => (
				<>
					<a
						onClick={() => {
							setEditing(rec);
							setVisible(true);
						}}
					>
						Sửa
					</a>
					&nbsp;|&nbsp;
					<Popconfirm title='Xóa?' onConfirm={() => setData((d) => d.filter((i) => i.id !== rec.id))}>
						<a>Xóa</a>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title='Nhật ký chỉ số sức khỏe'>
			<div className='health-controls'>
				<Button
					type='primary'
					onClick={() => {
						setEditing(null);
						setVisible(true);
					}}
				>
					Thêm chỉ số
				</Button>
			</div>
			<Table dataSource={data} columns={columns} rowKey='id' />

			<Modal visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
				<Form
					initialValues={
						editing || {
							date: moment().format('YYYY-MM-DD'),
							weight: 70,
							height: 170,
							restingHr: 60,
							sleepTime: '23:00',
						}
					}
					onFinish={(vals: any) => {
						const item: Health = {
							id: editing ? editing.id : String(Date.now()),
							date: vals.date && vals.date.format ? vals.date.format('YYYY-MM-DD') : vals.date,
							weight: vals.weight,
							height: vals.height,
							restingHr: vals.restingHr,
							sleepTime: vals.sleepTime,
						};
						setData((d) => (editing ? d.map((i) => (i.id === item.id ? item : i)) : [item, ...d]));
						setVisible(false);
					}}
				>
					<Form.Item name='date' label='Ngày'>
						<DatePicker />
					</Form.Item>
					<Form.Item name='weight' label='Cân nặng (kg)'>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item name='height' label='Chiều cao (cm)'>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item name='restingHr' label='Nhịp tim lúc nghỉ (bpm)'>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item name='sleepTime' label='Giờ ngủ'>
						<InputNumber min={0} max={23} />
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

export default HealthLog;
