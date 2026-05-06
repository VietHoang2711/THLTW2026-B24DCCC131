import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Input, Select, Button, Space, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import service, { TaskItem } from './service';
import TaskForm from './TaskForm';

const { Option } = Select;

const priorityColor = (p: TaskItem['priority'] | string) => {
	if (p === 'High') return 'red';
	if (p === 'Medium') return 'gold';
	return 'green';
};

const priorityLabel = (p: TaskItem['priority'] | string) => {
	switch (p) {
		case 'High':
			return 'Cao';
		case 'Medium':
			return 'Trung bình';
		case 'Low':
			return 'Thấp';
		default:
			return p as string;
	}
};

const TaskList: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [q, setQ] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
	const [editing, setEditing] = useState<TaskItem | undefined>();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setTasks(service.loadTasks());
	}, []);

	const save = (next: TaskItem[]) => {
		setTasks(next);
		service.saveTasks(next);
	};

	const handleSave = (task: TaskItem) => {
		const exists = tasks.find((t) => t.id === task.id);
		const next = exists ? tasks.map((t) => (t.id === task.id ? task : t)) : [task, ...tasks];
		save(next);
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		const next = tasks.filter((t) => t.id !== id);
		save(next);
	};

	const data = useMemo(() => {
		return tasks.filter((t) => {
			if (filterStatus && t.status !== filterStatus) return false;
			if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [tasks, q, filterStatus]);

	const columns: ColumnsType<TaskItem> = [
		{ title: 'Tên', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			render: (p) => <Tag color={priorityColor(p)}>{priorityLabel(p)}</Tag>,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			sorter: (a, b) => (a.deadline ? 1 : 0) - (b.deadline ? 1 : 0),
			render: (d) => (d ? moment(d).format('YYYY-MM-DD HH:mm') : '-'),
		},
		{ title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s) => <Tag>{s}</Tag> },
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (tags || []).map((t) => <Tag key={t}>{t}</Tag>),
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button
						size='small'
						onClick={() => {
							setEditing(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button size='small'>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<h2>Danh Sách Task</h2>
			<div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
				<Input.Search placeholder='Tìm theo tên' onSearch={(v) => setQ(v)} style={{ width: 240 }} allowClear />
				<Select placeholder='Lọc trạng thái' style={{ width: 160 }} allowClear onChange={(v) => setFilterStatus(v)}>
					<Option value='todo'>Cần làm</Option>
					<Option value='doing'>Đang làm</Option>
					<Option value='done'>Hoàn thành</Option>
				</Select>
				<Button
					type='primary'
					onClick={() => {
						setEditing(undefined);
						setVisible(true);
					}}
				>
					Thêm Task
				</Button>
			</div>

			<Table rowKey='id' dataSource={data} columns={columns} />

			<TaskForm visible={visible} initial={editing} onCancel={() => setVisible(false)} onSave={handleSave} />
		</div>
	);
};

export default TaskList;
