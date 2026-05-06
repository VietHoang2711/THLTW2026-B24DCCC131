import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Space, Tag } from 'antd';
import moment from 'moment';
import { TaskItem, Priority, genId } from './service';

const { TextArea } = Input;
const { Option } = Select;

type Props = {
	visible: boolean;
	initial?: Partial<TaskItem>;
	onCancel: () => void;
	onSave: (task: TaskItem) => void;
};

const TaskForm: React.FC<Props> = ({ visible, initial, onCancel, onSave }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.setFieldsValue({
				...initial,
				deadline: initial?.deadline ? moment(initial.deadline) : undefined,
			});
		}
	}, [visible, initial]);

	return (
		<Modal
			title={initial?.id ? 'Chỉnh sửa Task' : 'Thêm Task'}
			visible={visible}
			onCancel={onCancel}
			okText='Lưu'
			onOk={async () => {
				const values = await form.validateFields();
				const task: TaskItem = {
					id: ((initial && initial.id) as string) || genId(),
					title: values.title,
					description: values.description,
					deadline: values.deadline ? values.deadline.toISOString() : undefined,
					priority: values.priority as Priority,
					tags: (values.tags || '')
						.split(',')
						.map((t: string) => t.trim())
						.filter(Boolean),
					status: (initial && initial.status) || 'todo',
					createdAt: (initial && initial.createdAt) || new Date().toISOString(),
				};
				onSave(task);
			}}
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='title' label='Tên Task' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<TextArea rows={3} />
				</Form.Item>
				<Form.Item name='deadline' label='Deadline'>
					<DatePicker showTime />
				</Form.Item>
				<Form.Item name='priority' label='Ưu tiên' initialValue='Medium'>
					<Select>
						<Option value='High'>Cao</Option>
						<Option value='Medium'>Trung bình</Option>
						<Option value='Low'>Thấp</Option>
					</Select>
				</Form.Item>
				<Form.Item name='tags' label='Tags (phân cách bằng dấu ,)'>
					<Input placeholder='tag1, tag2' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskForm;
