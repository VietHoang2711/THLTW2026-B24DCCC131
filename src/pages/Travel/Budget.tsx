import React, { useEffect, useMemo, useState } from 'react';
import { Card, Progress, Alert, InputNumber, Row, Col } from 'antd';
import ReactApexChart from 'react-apexcharts';

const saveKey = 'travel_planner';

export default function Budget(): JSX.Element {
	const [planner, setPlanner] = useState<any[]>([]);
	const [budget, setBudget] = useState<number>(500);

	useEffect(() => {
		const raw = localStorage.getItem(saveKey);
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				// normalize numeric fields
				const normalized = (parsed || []).map((d: any) => ({
					...d,
					items: (d.items || []).map((it: any) => ({
						...it,
						price: Number(it.price || 0),
						rating: Number(it.rating || 0),
						costBreakdown: {
							food: Number(it?.costBreakdown?.food || 0),
							transport: Number(it?.costBreakdown?.transport || 0),
							lodging: Number(it?.costBreakdown?.lodging || 0),
						},
					})),
				}));
				setPlanner(normalized);
			} catch {}
		}
	}, []);

	const totals = useMemo(() => {
		const res = { food: 0, transport: 0, lodging: 0, activities: 0 } as any;
		planner.forEach((d) =>
			d.items.forEach((it: any) => {
				res.food += Number(it?.costBreakdown?.food || 0);
				res.transport += Number(it?.costBreakdown?.transport || 0);
				res.lodging += Number(it?.costBreakdown?.lodging || 0);
				res.activities += Number(it?.price || 0);
			}),
		);
		res.total = res.food + res.transport + res.lodging + res.activities;
		return res;
	}, [planner]);

	const chartOptions = useMemo(
		() => ({
			chart: { type: 'donut' },
			labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Hoạt động'],
			legend: { position: 'bottom' },
			responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }],
		}),
		[],
	);

	const chartSeries = useMemo(() => [totals.food, totals.transport, totals.lodging, totals.activities], [totals]);

	const pct = Math.round((totals.total / Math.max(1, budget)) * 100);

	return (
		<div style={{ padding: 16 }}>
			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Card title='Cài đặt ngân sách'>
						<div style={{ marginBottom: 8 }}>
							Ngân sách dự kiến: <InputNumber value={budget} onChange={(v) => setBudget(v as number)} />
						</div>
						<div style={{ marginTop: 12 }}>
							Tổng chi phí dự kiến: <strong>${totals.total}</strong>
						</div>
						{totals.total > budget ? (
							<Alert
								style={{ marginTop: 12 }}
								message={`Vượt ngân sách: $${(totals.total - budget).toFixed(2)}`}
								description={`Tổng chi phí ${totals.total.toFixed(2)} vượt so với ngân sách ${budget.toFixed(2)}`}
								type='error'
								showIcon
							/>
						) : (
							<Alert
								style={{ marginTop: 12 }}
								message={`Trong ngân sách: $${(budget - totals.total).toFixed(2)} còn lại`}
								description={`Tổng chi phí ${totals.total.toFixed(2)} trong ngân sách ${budget.toFixed(2)}`}
								type='success'
								showIcon
							/>
						)}
						<div style={{ marginTop: 12 }}>
							<Progress percent={pct > 100 ? 100 : pct} status={totals.total > budget ? 'exception' : 'active'} />
						</div>
					</Card>
				</Col>

				<Col xs={24} md={12}>
					<Card title='Phân bổ'>
						<div style={{ marginBottom: 12 }}>
							<ReactApexChart options={chartOptions as any} series={chartSeries} type='donut' height={280} />
						</div>
						<div style={{ marginBottom: 8 }}>Ăn uống: ${totals.food}</div>
						<div style={{ marginBottom: 8 }}>Di chuyển: ${totals.transport}</div>
						<div style={{ marginBottom: 8 }}>Lưu trú: ${totals.lodging}</div>
						<div style={{ marginBottom: 8 }}>Hoạt động: ${totals.activities}</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
