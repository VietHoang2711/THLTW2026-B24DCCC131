import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Timeline } from 'antd';
import Chart from 'react-apexcharts';

const mockSessions = [
	{ date: '2026-05-01', type: 'Cardio', duration: 30, calories: 250 },
	{ date: '2026-05-03', type: 'Strength', duration: 45, calories: 350 },
	{ date: '2026-05-07', type: 'Yoga', duration: 60, calories: 180 },
	{ date: '2026-05-10', type: 'HIIT', duration: 25, calories: 300 },
	{ date: '2026-05-12', type: 'Cardio', duration: 40, calories: 320 },
	{ date: '2026-05-18', type: 'Strength', duration: 50, calories: 420 },
];

const weightLog = [
	{ date: '2026-04-01', weight: 72 },
	{ date: '2026-04-15', weight: 71 },
	{ date: '2026-05-01', weight: 70 },
	{ date: '2026-05-15', weight: 69 },
];

const Dashboard: React.FC = () => {
	const totalSessions = mockSessions.length;
	const totalCalories = mockSessions.reduce((s, i) => s + i.calories, 0);

	const streak = 3; // simplified mock

	const goalPercent = 45;

	const weeklyCounts = useMemo(() => {
		// group by week index (simple mock)
		return [2, 1, 2, 1];
	}, []);

	return (
		<div>
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Card>
						<Statistic title='Buổi tập tháng' value={totalSessions} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng calo' value={totalCalories} suffix='kcal' />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Streak' value={streak} suffix='ngày' />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Mục tiêu hoàn thành' value={`${goalPercent}%`} />
					</Card>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={12}>
					<Card title='Buổi tập theo tuần'>
						<Chart
							options={{
								chart: { id: 'sessions' },
								xaxis: { categories: ['W1', 'W2', 'W3', 'W4'] },
							}}
							series={[{ name: 'Buổi tập', data: weeklyCounts }]}
							type='bar'
							height={300}
						/>
					</Card>
				</Col>
				<Col span={12}>
					<Card title='Cân nặng theo thời gian'>
						<Chart
							options={{
								chart: { id: 'weight' },
								xaxis: { categories: weightLog.map((w) => w.date) },
							}}
							series={[{ name: 'Cân nặng', data: weightLog.map((w) => w.weight) }]}
							type='line'
							height={300}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='5 buổi tập gần nhất'>
				<Timeline>
					{mockSessions
						.slice()
						.reverse()
						.slice(0, 5)
						.map((s) => (
							<Timeline.Item key={s.date}>
								{s.date} — {s.type} — {s.duration} phút — {s.calories} kcal
							</Timeline.Item>
						))}
				</Timeline>
			</Card>
		</div>
	);
};

export default Dashboard;
