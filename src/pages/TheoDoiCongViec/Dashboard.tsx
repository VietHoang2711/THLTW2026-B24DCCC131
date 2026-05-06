import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { history } from 'umi';
import service, { TaskItem } from './service';

const Dashboard: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);

	useEffect(() => {
		setTasks(service.loadTasks());
	}, []);

	const total = tasks.length;
	const done = tasks.filter((t) => t.status === 'done').length;
	const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length;

	return (
		<div>
			<h1>Theo Dõi Công Việc — Dashboard</h1>
			<Row gutter={16} style={{ marginTop: 16 }}>
				<Col span={8}>
					<Card>
						<h3>Tổng số task</h3>
						<div style={{ fontSize: 28 }}>{total}</div>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<h3>Hoàn thành</h3>
						<div style={{ fontSize: 28 }}>{done}</div>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<h3>Quá hạn</h3>
						<div style={{ fontSize: 28, color: overdue ? 'red' : undefined }}>{overdue}</div>
					</Card>
				</Col>
			</Row>

			<div style={{ marginTop: 20 }}>
				<Button type='primary' onClick={() => history.push('/theo-doi-cong-viec/kanban')} style={{ marginRight: 8 }}>
					Mở Kanban
				</Button>
				<Button onClick={() => history.push('/theo-doi-cong-viec/list')}>Danh sách</Button>
			</div>
		</div>
	);
};

export default Dashboard;
