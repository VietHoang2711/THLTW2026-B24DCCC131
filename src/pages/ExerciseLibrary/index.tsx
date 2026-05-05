import React, { useState } from 'react';
import { Card, Row, Col, Input, Select, Modal, Button, Popconfirm } from 'antd';
import './index.less';

type Exercise = {
	id: string;
	name: string;
	muscle: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	description?: string;
	caloriesPerHour?: number;
};

const initial: Exercise[] = [
	{
		id: '1',
		name: 'Push Up',
		muscle: 'Chest',
		difficulty: 'Medium',
		description: 'Bodyweight push up',
		caloriesPerHour: 400,
	},
	{
		id: '2',
		name: 'Squat',
		muscle: 'Legs',
		difficulty: 'Medium',
		description: 'Bodyweight squat',
		caloriesPerHour: 450,
	},
];

const ExerciseLibrary: React.FC = () => {
	const [data, setData] = useState<Exercise[]>(initial);
	const [search, setSearch] = useState('');
	const [muscle, setMuscle] = useState<string | undefined>(undefined);
	const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
	const [selected, setSelected] = useState<Exercise | null>(null);
	const [visible, setVisible] = useState(false);

	const filtered = data.filter((d) => {
		if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
		if (muscle && d.muscle !== muscle) return false;
		if (difficulty && d.difficulty !== difficulty) return false;
		return true;
	});

	return (
		<div>
			<div className='exercise-controls'>
				<Input
					placeholder='Tìm bài tập'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 240 }}
				/>
				<Select allowClear placeholder='Nhóm cơ' style={{ width: 160 }} onChange={(v) => setMuscle(v)}>
					<Select.Option value='Chest'>Chest</Select.Option>
					<Select.Option value='Back'>Back</Select.Option>
					<Select.Option value='Legs'>Legs</Select.Option>
					<Select.Option value='Shoulders'>Shoulders</Select.Option>
					<Select.Option value='Arms'>Arms</Select.Option>
					<Select.Option value='Core'>Core</Select.Option>
					<Select.Option value='Full Body'>Full Body</Select.Option>
				</Select>
				<Select allowClear placeholder='Mức độ' style={{ width: 160 }} onChange={(v) => setDifficulty(v)}>
					<Select.Option value='Easy'>Dễ</Select.Option>
					<Select.Option value='Medium'>Trung bình</Select.Option>
					<Select.Option value='Hard'>Khó</Select.Option>
				</Select>
				<Button
					type='primary'
					onClick={() => {
						setSelected(null);
						setVisible(true);
					}}
				>
					Thêm
				</Button>
			</div>

			<Row gutter={[16, 16]}>
				{filtered.map((ex) => (
					<Col span={8} key={ex.id}>
						<Card
							hoverable
							onClick={() => {
								setSelected(ex);
								setVisible(true);
							}}
						>
							<h3>{ex.name}</h3>
							<div>Nhóm cơ: {ex.muscle}</div>
							<div>Mức độ: {ex.difficulty}</div>
							<div>{ex.description}</div>
							<div>{ex.caloriesPerHour} kcal/giờ</div>
						</Card>
					</Col>
				))}
			</Row>

			<Modal visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
				<h3>{selected ? 'Chi tiết bài tập' : 'Thêm bài tập'}</h3>
				{selected ? (
					<div>
						<p>{selected.description}</p>
						<div className='exercise-actions'>
							<Popconfirm title='Xóa bài tập?' onConfirm={() => setData((d) => d.filter((i) => i.id !== selected.id))}>
								<Button danger> Xóa </Button>
							</Popconfirm>
						</div>
					</div>
				) : (
					<div>
						{/* simple add form */}
						<Button
							onClick={() => {
								setData((d) => [
									{
										id: String(Date.now()),
										name: 'New Exercise',
										muscle: 'Full Body',
										difficulty: 'Easy',
										description: '',
										caloriesPerHour: 300,
									},
									...d,
								]);
								setVisible(false);
							}}
						>
							Tạo nhanh
						</Button>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ExerciseLibrary;
