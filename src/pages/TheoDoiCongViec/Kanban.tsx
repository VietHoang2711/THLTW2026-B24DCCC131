import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import service, { TaskItem } from './service';
import TaskForm from './TaskForm';

const { Title, Paragraph } = Typography;

const priorityColor = (p: TaskItem['priority']) => {
	if (p === 'High') return 'red';
	if (p === 'Medium') return 'gold';
	return 'green';
};

const priorityLabel = (p: TaskItem['priority']) => {
	switch (p) {
		case 'High':
			return 'Cao';
		case 'Medium':
			return 'Trung bình';
		case 'Low':
			return 'Thấp';
		default:
			return p;
	}
};

const statusOrder: { key: TaskItem['status']; title: string }[] = [
	{ key: 'todo', title: 'Cần làm' },
	{ key: 'doing', title: 'Đang làm' },
	{ key: 'done', title: 'Hoàn thành' },
];

const Kanban: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [editing, setEditing] = useState<TaskItem | undefined>();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setTasks(service.loadTasks());
	}, []);

	const save = (next: TaskItem[]) => {
		setTasks(next);
		service.saveTasks(next);
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const { draggableId, source, destination } = result;
		const srcStatus = source.droppableId as TaskItem['status'];
		const destStatus = destination.droppableId as TaskItem['status'];

		if (srcStatus === destStatus && source.index === destination.index) return;

		// Build lists per column
		const cols: Record<TaskItem['status'], TaskItem[]> = {
			todo: tasks.filter((t) => t.status === 'todo'),
			doing: tasks.filter((t) => t.status === 'doing'),
			done: tasks.filter((t) => t.status === 'done'),
		};

		// Find the dragged item
		const dragged = cols[srcStatus].find((t) => t.id === draggableId);
		if (!dragged) return;

		// Remove from source
		const srcList = Array.from(cols[srcStatus]);
		srcList.splice(source.index, 1);

		// Insert into destination (update status)
		const destList = Array.from(cols[destStatus]);
		const updated = { ...dragged, status: destStatus };
		destList.splice(destination.index, 0, updated);

		// Update column lists with removed/inserted items
		const newCols: Record<TaskItem['status'], TaskItem[]> = {
			todo: cols.todo,
			doing: cols.doing,
			done: cols.done,
		};

		newCols[srcStatus] = srcList;
		newCols[destStatus] = destList;

		const nextTasks = [...newCols.todo, ...newCols.doing, ...newCols.done];

		save(nextTasks);
	};

	const openNew = () => {
		setEditing(undefined);
		setVisible(true);
	};

	const handleSave = (task: TaskItem) => {
		const exists = tasks.find((t) => t.id === task.id);
		const next = exists ? tasks.map((t) => (t.id === task.id ? task : t)) : [task, ...tasks];
		save(next);
		setVisible(false);
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Kanban — Theo Dõi Công Việc</h2>
				<div>
					<Button type='primary' onClick={openNew} style={{ marginBottom: 8 }}>
						Thêm Task
					</Button>
				</div>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
					{statusOrder.map((col) => (
						<Droppable droppableId={col.key} key={col.key}>
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} style={{ minWidth: 320 }}>
									<Card title={col.title} style={{ minHeight: 300 }}>
										{tasks
											.filter((t) => t.status === col.key)
											.map((task, index) => (
												<Draggable key={task.id} draggableId={task.id} index={index}>
													{(prov) => (
														<div
															ref={prov.innerRef}
															{...prov.draggableProps}
															{...prov.dragHandleProps}
															style={{
																marginBottom: 8,
																padding: 8,
																background: '#fff',
																border: '1px solid #eee',
																...prov.draggableProps.style,
															}}
														>
															<Title level={5}>{task.title}</Title>
															<Paragraph ellipsis={{ rows: 2 }}>{task.description}</Paragraph>
															<div
																style={{
																	display: 'flex',
																	gap: 8,
																	justifyContent: 'space-between',
																	alignItems: 'center',
																}}
															>
																<div>
																	<Tag color={priorityColor(task.priority)}>{priorityLabel(task.priority)}</Tag>
																	{(task.tags || []).slice(0, 3).map((tag) => (
																		<Tag key={tag}>{tag}</Tag>
																	))}
																</div>
																<div>
																	<Button
																		size='small'
																		onClick={() => {
																			setEditing(task);
																			setVisible(true);
																		}}
																	>
																		Edit
																	</Button>
																</div>
															</div>
														</div>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</Card>
								</div>
							)}
						</Droppable>
					))}
				</div>
			</DragDropContext>

			<TaskForm visible={visible} initial={editing} onCancel={() => setVisible(false)} onSave={handleSave} />
		</div>
	);
};

export default Kanban;
