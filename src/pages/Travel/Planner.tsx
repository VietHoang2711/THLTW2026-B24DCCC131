import React, { useEffect, useMemo, useState } from 'react';
import { List, Button, Select, Card, Row, Col, DatePicker, InputNumber, message } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';
import { DEFAULT_DESTINATIONS, Destination } from '../../models/travel/destinations';

interface DayPlan {
	id: string;
	date?: string;
	items: Destination[];
}

const saveKey = 'travel_planner';

export default function Planner(): JSX.Element {
	const [available, setAvailable] = useState<Destination[]>(DEFAULT_DESTINATIONS);
	const [selectedDestIds, setSelectedDestIds] = useState<string[]>([]);
	const [selectedDateForCreate, setSelectedDateForCreate] = useState<moment.Moment | null>(null);
	const [days, setDays] = useState<DayPlan[]>([]);
	const [selectedDay, setSelectedDay] = useState<string | null>(null);

	const normalizeDestination = (it: any): Destination => {
		const cost = it?.costBreakdown || {};
		return {
			id: String(it.id),
			title: it.title || it.name || 'Unknown',
			type: it.type || 'city',
			image: it.image || '',
			price: Number(it.price) || 0,
			rating: Number(it.rating) || 0,
			durationMins: Number(it.durationMins) || 0,
			costBreakdown: {
				food: Number(cost.food) || 0,
				transport: Number(cost.transport) || 0,
				lodging: Number(cost.lodging) || 0,
			},
		} as Destination;
	};

	const availableMap = React.useMemo(() => {
		const m = new Map<string, Destination>();
		available.forEach((a) => m.set(String(a.id), normalizeDestination(a)));
		return m;
	}, [available]);

	useEffect(() => {
		const raw = localStorage.getItem(saveKey);
		if (raw) {
			try {
				const parsedDays = JSON.parse(raw) as DayPlan[];
				const normalizedDays = parsedDays.map((d) => ({
					...d,
					items: (d.items || []).map((it: any) => normalizeDestination(it)),
				}));
				setDays(normalizedDays);
				if (normalizedDays[0]) setSelectedDay(normalizedDays[0].id);
			} catch {}
		}
		// load destinations from admin/localStorage if present
		try {
			const destRaw = localStorage.getItem('travel_destinations');
			if (destRaw) {
				const parsed = JSON.parse(destRaw) as Destination[];
				if (Array.isArray(parsed) && parsed.length > 0) setAvailable(parsed.map(normalizeDestination));
			}
		} catch {}
		// normalize default available set as well
		setAvailable((prev) => prev.map(normalizeDestination));
	}, []);

	useEffect(() => {
		localStorage.setItem(saveKey, JSON.stringify(days));
	}, [days]);

	const addDay = () => {
		const id = `day-${Date.now()}`;
		const next: DayPlan = { id, date: undefined, items: [] };
		setDays((s) => [...s, next]);
		setSelectedDay(id);
	};

	const removeDay = (id: string) => {
		setDays((s) => s.filter((d) => d.id !== id));
		if (selectedDay === id) setSelectedDay(null);
	};

	const addSelectedToDay = () => {
		if (!selectedDay) return message.warn('Vui lòng chọn ngày trước');
		const day = days.find((d) => d.id === selectedDay);
		if (!day) return message.warn('Ngày không tồn tại');
		if (!day.date) return message.warn('Vui lòng chọn ngày (ở cột Ngày) trước khi thêm điểm đến');
		const toAdd = selectedDestIds.map((id) => availableMap.get(String(id))).filter(Boolean) as Destination[];
		if (toAdd.length === 0) return message.warn('Vui lòng chọn ít nhất một điểm đến');
		setDays((s) => s.map((d) => (d.id === selectedDay ? { ...d, items: [...d.items, ...toAdd] } : d)));
		setSelectedDestIds([]);
		message.success('Đã thêm điểm đến vào ngày');
	};

	const previewBudget = () => {
		const toAdd = selectedDestIds.map((id) => availableMap.get(String(id))).filter(Boolean) as Destination[];
		let total = 0;
		toAdd.forEach((it) => {
			total +=
				Number(it.price || 0) +
				Number(it.costBreakdown?.food || 0) +
				Number(it.costBreakdown?.lodging || 0) +
				Number(it.costBreakdown?.transport || 0);
		});
		return total;
	};

	const createDayFromSelection = () => {
		if (selectedDestIds.length === 0) return message.warn('Vui lòng chọn ít nhất một điểm đến');
		if (!selectedDateForCreate) return message.warn('Vui lòng chọn ngày cho lịch mới');
		const id = `day-${Date.now()}`;
		const items = selectedDestIds.map((id) => availableMap.get(String(id))).filter(Boolean) as Destination[];
		const newDay: DayPlan = { id, date: selectedDateForCreate.format('YYYY-MM-DD'), items };
		setDays((s) => [...s, newDay]);
		setSelectedDay(id);
		setSelectedDestIds([]);
		setSelectedDateForCreate(null);
		message.success('Đã tạo ngày mới');
	};

	const dayBudget = (d: DayPlan) => {
		let total = 0;
		d.items.forEach((it) => {
			total +=
				Number(it.price || 0) +
				Number(it.costBreakdown?.food || 0) +
				Number(it.costBreakdown?.lodging || 0) +
				Number(it.costBreakdown?.transport || 0);
		});
		return total;
	};

	const estimateTravelTime = (a?: Destination, b?: Destination) => {
		if (!a || !b) return 0;
		// simple heuristic: same type shorter, different type longer
		return a.type === b.type ? 30 : 90; // minutes
	};

	const dayTravelTime = (d: DayPlan) => {
		if (!d.items || d.items.length <= 1) return 0;
		let total = 0;
		for (let i = 0; i < d.items.length - 1; i++) {
			total += estimateTravelTime(d.items[i], d.items[i + 1]);
		}
		return total; // minutes
	};

	const formatMinutes = (mins: number) => {
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		return `${h}h ${m}m`;
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const sourceId = result.source.droppableId;
		const destId = result.destination.droppableId;
		// only allow reordering within same day for now
		if (sourceId !== destId) return;
		const dayIndex = days.findIndex((d) => d.id === sourceId);
		if (dayIndex === -1) return;
		const day = days[dayIndex];
		const items = Array.from(day.items);
		const [moved] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, moved);
		const next = days.slice();
		next[dayIndex] = { ...day, items };
		setDays(next);
	};

	const setDateForDay = (id: string, dateStr?: string) => {
		setDays((s) => s.map((d) => (d.id === id ? { ...d, date: dateStr || undefined } : d)));
	};

	const removeItem = (dayId: string, idx: number) => {
		setDays((s) => {
			const next = s.map((d) => {
				if (d.id !== dayId) return d;
				const items = d.items.slice();
				items.splice(idx, 1);
				return { ...d, items };
			});
			// remove days that have no items
			const filtered = next.filter((d) => !(d.id === dayId && d.items.length === 0));
			if (filtered.length !== next.length) {
				// if the currently selected day was removed, clear selection
				if (selectedDay === dayId) setSelectedDay(null);
				message.info('Ngày trống đã được xóa');
			}
			return filtered;
		});
	};

	const totalBudget = useMemo(() => {
		let total = 0;
		days.forEach((d) =>
			d.items.forEach((it) => {
				total +=
					Number(it.price || 0) +
					Number(it.costBreakdown?.food || 0) +
					Number(it.costBreakdown?.lodging || 0) +
					Number(it.costBreakdown?.transport || 0);
			}),
		);
		return total;
	}, [days]);

	return (
		<div style={{ padding: 16 }}>
			<Row gutter={16}>
				<Col xs={24} md={8}>
					<Card title='Thêm điểm đến'>
						<Select
							style={{ width: '100%' }}
							placeholder='Chọn điểm đến (hỗ trợ chọn nhiều)'
							value={selectedDestIds}
							onChange={(v) => setSelectedDestIds(Array.isArray(v) ? v : [v])}
							mode='multiple'
							showSearch
							optionFilterProp='children'
							allowClear
						>
							{available.map((a) => (
								<Select.Option key={a.id} value={a.id}>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span>
											{a.title} • {a.type}
										</span>
										<span style={{ color: '#888' }}>
											${a.price} • {a.rating}★
										</span>
									</div>
								</Select.Option>
							))}
						</Select>

						<DatePicker
							style={{ width: 180, marginLeft: 8 }}
							value={selectedDateForCreate}
							onChange={(d) => setSelectedDateForCreate(d)}
							format='YYYY-MM-DD'
						/>
						<div style={{ marginTop: 8 }}>
							<div>
								Ngân sách dự kiến cho lựa chọn: <strong>${previewBudget()}</strong>
							</div>
							<div style={{ marginTop: 8 }}>
								<Button type='primary' size='large' block onClick={createDayFromSelection}>
									Tạo ngày mới từ lựa chọn
								</Button>
							</div>
						</div>
						<div style={{ marginTop: 12 }}></div>
					</Card>
				</Col>

				<Col xs={24} md={8}>
					<Card title='Tổng quan'>
						<div style={{ marginBottom: 8 }}>Số ngày: {days.length}</div>
						<div style={{ marginBottom: 8 }}>Tổng ngân sách ước tính: ${totalBudget}</div>
					</Card>
				</Col>
			</Row>

			<div style={{ marginTop: 16 }}>
				<DragDropContext onDragEnd={onDragEnd}>
					{days.map((d) => (
						<Droppable key={d.id} droppableId={d.id}>
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									<Card
										key={d.id}
										title={`${d.date || d.id} — Ngân sách: $${dayBudget(d)} — Thời gian: ${formatMinutes(
											d.items.reduce((s, it) => s + Number(it.durationMins || 0), 0) + dayTravelTime(d),
										)}`}
										style={{ marginBottom: 12 }}
									>
										{d.items.length === 0 && (
											<div style={{ textAlign: 'center', padding: 24, color: '#999' }}>Trống</div>
										)}
										{d.items.map((it, idx) => (
											<Draggable key={it.id + '-' + idx} draggableId={String(it.id) + '-' + idx} index={idx}>
												{(prov) => (
													<div
														ref={prov.innerRef}
														{...prov.draggableProps}
														{...prov.dragHandleProps}
														style={{
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
															padding: 8,
															borderBottom: '1px solid #f0f0f0',
															...prov.draggableProps.style,
														}}
													>
														<div>
															<strong>{it.title}</strong>
															<div style={{ fontSize: 12, color: '#666' }}>{`Giá: $${it.price} • ${
																it.rating
															}★ • Tham quan ${Math.round((it.durationMins || 0) / 60)}h`}</div>
														</div>
														<div>
															<a style={{ marginRight: 12 }} onClick={() => removeItem(d.id, idx)}>
																Xóa
															</a>
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
				</DragDropContext>
			</div>
		</div>
	);
}
