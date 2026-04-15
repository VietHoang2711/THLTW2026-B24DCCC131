import React, { useState, useMemo } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Space,
	Tag,
	message,
	Popconfirm,
	Row,
	Col,
	Statistic,
	Empty,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SearchOutlined,
	ReloadOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import { useDonHangModel, DonHangStatus, DonHang, DonHangProduct } from '@/models/donhang';
import { useSanPhamModel } from '@/models/sanpham';
import styles from './index.less';

const DonHangPage: React.FC = () => {
	const donHangModel = useDonHangModel();
	const sanPhamModel = useSanPhamModel();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<DonHangStatus | 'all'>('all');
	const [sortby, setSortby] = useState<'date' | 'amount'>('date');
	const [selectedProducts, setSelectedProducts] = useState<DonHangProduct[]>([]);

	const statusColors: Record<DonHangStatus, string> = {
		'Chờ xác nhận': 'orange',
		'Đang giao': 'blue',
		'Hoàn thành': 'green',
		Hủy: 'red',
	};

	// Search and filter logic
	const filteredData = useMemo(() => {
		let result = searchText ? donHangModel.searchDonHang(searchText) : donHangModel.donHangs;

		if (filterStatus !== 'all') {
			result = result.filter((dh) => dh.status === filterStatus);
		}

		// Sort
		result = result.sort((a, b) => {
			if (sortby === 'date') {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else {
				return b.totalAmount - a.totalAmount;
			}
		});

		return result;
	}, [donHangModel.donHangs, searchText, filterStatus, sortby]);

	const handleAddNew = () => {
		setEditingId(null);
		setSelectedProducts([]);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (record: DonHang) => {
		setEditingId(record.id);
		setSelectedProducts(record.products);
		form.setFieldsValue({
			customerName: record.customerName,
			phone: record.phone,
			address: record.address,
			status: record.status,
		});
		setIsModalVisible(true);
	};

	const handleAddProduct = () => {
		const productId = form.getFieldValue('productId');
		const quantity = form.getFieldValue('productQuantity');

		if (!productId || !quantity || quantity < 1) {
			message.error('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
			return;
		}

		const product = sanPhamModel.getSanPhamById(productId);
		if (!product) {
			message.error('Sản phẩm không tồn tại');
			return;
		}

		// Check if product already in selection
		const existingIndex = selectedProducts.findIndex((p) => p.productId === productId);
		if (existingIndex > -1) {
			const newProducts = [...selectedProducts];
			newProducts[existingIndex].quantity += quantity;
			setSelectedProducts(newProducts);
		} else {
			setSelectedProducts([
				...selectedProducts,
				{
					productId,
					productName: product.name,
					quantity,
					price: product.price,
				},
			]);
		}

		form.setFieldsValue({
			productId: undefined,
			productQuantity: undefined,
		});
		message.success('Đã thêm sản phẩm');
	};

	const handleRemoveProduct = (productId: number) => {
		setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
	};

	const calculateTotal = () => {
		return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();

			if (selectedProducts.length === 0) {
				message.error('Vui lòng thêm ít nhất một sản phẩm');
				return;
			}

			const totalAmount = calculateTotal();

			if (editingId) {
				// Check for duplicate ID in edit mode (if changing ID)
				const isDuplicate = donHangModel.donHangs.some((dh) => dh.id !== editingId && dh.id === values.id);
				if (isDuplicate) {
					message.error('Mã đơn hàng đã tồn tại');
					return;
				}

				donHangModel.updateDonHang(editingId, {
					customerName: values.customerName,
					phone: values.phone,
					address: values.address,
					products: selectedProducts,
					totalAmount,
					status: values.status,
				});
				message.success('Cập nhật đơn hàng thành công');
			} else {
				// Check for duplicate ID in add mode
				if (donHangModel.isDonHangIdExists(values.id)) {
					message.error('Mã đơn hàng đã tồn tại');
					return;
				}

				donHangModel.addDonHang({
					id: values.id,
					customerName: values.customerName,
					phone: values.phone,
					address: values.address,
					products: selectedProducts,
					totalAmount,
					status: values.status,
				} as Omit<DonHang, 'createdAt'>);
				message.success('Thêm đơn hàng thành công');
			}

			setIsModalVisible(false);
			form.resetFields();
			setSelectedProducts([]);
		} catch {
			message.error('Vui lòng kiểm tra lại các trường bắt buộc');
		}
	};

	const handleCancel = () => {
		if (selectedProducts.length > 0) {
			Modal.confirm({
				title: 'Bạn chắc chắn muốn hủy?',
				content: 'Dữ liệu chưa lưu sẽ bị mất',
				okText: 'Có',
				cancelText: 'Không',
				onOk() {
					setIsModalVisible(false);
					form.resetFields();
					setSelectedProducts([]);
				},
			});
		} else {
			setIsModalVisible(false);
			form.resetFields();
			setSelectedProducts([]);
		}
	};

	const handleCancelOrder = (record: DonHang) => {
		if (!donHangModel.canCancelOrder(record.status)) {
			message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
			return;
		}

		Modal.confirm({
			title: 'Xác nhận hủy đơn hàng',
			content: `Bạn chắc chắn muốn hủy đơn hàng ${record.id}? Hành động này không thể hoàn tác.`,
			okText: 'Hủy đơn',
			cancelText: 'Giữ lại',
			okButtonProps: { danger: true },
			onOk() {
				donHangModel.updateDonHangStatus(record.id, 'Hủy');
				message.success('Đơn hàng đã bị hủy');
			},
		});
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: 'Xóa đơn hàng',
			content: 'Bạn chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.',
			okText: 'Xóa',
			cancelText: 'Hủy',
			okButtonProps: { danger: true },
			onOk() {
				if (donHangModel.deleteDonHang(id)) {
					message.success('Xóa đơn hàng thành công');
				}
			},
		});
	};

	const columns = [
		{
			title: 'Mã Đơn Hàng',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			sorter: (a: DonHang, b: DonHang) => a.id.localeCompare(b.id),
		},
		{
			title: 'Khách Hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 150,
		},
		{
			title: 'Ngày Đặt',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 120,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
			sorter: (a: DonHang, b: DonHang) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Tổng Tiền',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: 130,
			render: (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
			sorter: (a: DonHang, b: DonHang) => a.totalAmount - b.totalAmount,
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: DonHangStatus) => <Tag color={statusColors[status]}>{status}</Tag>,
		},
		{
			title: 'Hành Động',
			key: 'action',
			width: 200,
			render: (_: any, record: DonHang) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					{record.status === 'Chờ xác nhận' && (
						<Button danger size='small' icon={<CloseCircleOutlined />} onClick={() => handleCancelOrder(record)}>
							Hủy
						</Button>
					)}
					<Popconfirm title='Xóa đơn hàng' okText='Xóa' cancelText='Hủy' onConfirm={() => handleDelete(record.id)}>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className={styles.container}>
			{/* Statistics */}
			<Row gutter={16} className={styles.statistics}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title='Tổng Đơn Hàng' value={donHangModel.donHangs.length} suffix='đơn' />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Chờ Xác Nhận'
							value={donHangModel.getDonHangsByStatus('Chờ xác nhận').length}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Đang Giao'
							value={donHangModel.getDonHangsByStatus('Đang giao').length}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Doanh Thu'
							value={donHangModel.getCompletedOrdersRevenue()}
							formatter={(value) => (value as number).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
						/>
					</Card>
				</Col>
			</Row>

			{/* Main Content */}
			<Card className={styles.card} style={{ marginTop: 16 }}>
				<div className={styles.toolbar}>
					<Space>
						<Input
							placeholder='Tìm theo mã đơn hoặc tên khách'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 250 }}
							allowClear
						/>
						<Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
							<Select.Option value='all'>Tất Cả Trạng Thái</Select.Option>
							<Select.Option value='Chờ xác nhận'>Chờ Xác Nhận</Select.Option>
							<Select.Option value='Đang giao'>Đang Giao</Select.Option>
							<Select.Option value='Hoàn thành'>Hoàn Thành</Select.Option>
							<Select.Option value='Hủy'>Hủy</Select.Option>
						</Select>
						<Select value={sortby} onChange={setSortby} style={{ width: 120 }}>
							<Select.Option value='date'>Sắp xếp: Ngày</Select.Option>
							<Select.Option value='amount'>Sắp xếp: Tiền</Select.Option>
						</Select>
						<Button
							icon={<ReloadOutlined />}
							onClick={() => {
								setSearchText('');
								setFilterStatus('all');
								setSortby('date');
							}}
						>
							Đặt Lại
						</Button>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleAddNew}>
							Thêm Đơn Hàng
						</Button>
					</Space>
				</div>

				{filteredData.length === 0 ? (
					<Empty description='Không có dữ liệu' />
				) : (
					<Table
						columns={columns}
						dataSource={filteredData}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						scroll={{ x: 1000 }}
					/>
				)}
			</Card>

			{/* Modal */}
			<Modal
				title={editingId ? 'Chỉnh Sửa Đơn Hàng' : 'Thêm Đơn Hàng'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleCancel}
				width={800}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					{!editingId && (
						<Form.Item
							label='Mã Đơn Hàng'
							name='id'
							rules={[
								{ required: true, message: 'Vui lòng nhập mã đơn hàng' },
								{
									validator: (_, value) => {
										if (value && donHangModel.isDonHangIdExists(value) && !editingId) {
											return Promise.reject(new Error('Mã đơn hàng đã tồn tại'));
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input placeholder='VD: DH001' />
						</Form.Item>
					)}
					<Form.Item
						label='Tên Khách Hàng'
						name='customerName'
						rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
					>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>
					<Form.Item
						label='Số Điện Thoại'
						name='phone'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>
					<Form.Item label='Địa Chỉ' name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
						<Input.TextArea rows={2} placeholder='Nhập địa chỉ giao hàng' />
					</Form.Item>

					{/* Product Selection */}
					<div className={styles.productSection}>
						<h4>Sản Phẩm Trong Đơn</h4>
						<div className={styles.productInputRow}>
							<Form.Item name='productId' style={{ marginBottom: 0, flex: 1 }}>
								<Select placeholder='Chọn sản phẩm'>
									{sanPhamModel.sanPhams.map((sp) => (
										<Select.Option key={sp.id} value={sp.id}>
											{sp.name} - {sp.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item name='productQuantity' style={{ marginBottom: 0, width: 100 }}>
								<InputNumber min={1} placeholder='SL' />
							</Form.Item>
							<Button type='primary' onClick={handleAddProduct}>
								Thêm
							</Button>
						</div>
					</div>

					{/* Selected Products */}
					{selectedProducts.length > 0 && (
						<div className={styles.selectedProducts}>
							<h4>Sản Phẩm Đã Chọn</h4>
							<Table
								dataSource={selectedProducts}
								columns={[
									{
										title: 'Sản Phẩm',
										dataIndex: 'productName',
										key: 'productName',
									},
									{
										title: 'Giá',
										dataIndex: 'price',
										key: 'price',
										width: 120,
										render: (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
									},
									{
										title: 'SL',
										dataIndex: 'quantity',
										key: 'quantity',
										width: 60,
									},
									{
										title: 'Thành Tiền',
										key: 'total',
										width: 120,
										render: (_, record) =>
											(record.price * record.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
									},
									{
										title: '',
										key: 'action',
										width: 80,
										render: (_, record) => (
											<Button
												danger
												size='small'
												icon={<DeleteOutlined />}
												onClick={() => handleRemoveProduct(record.productId)}
											>
												Xóa
											</Button>
										),
									},
								]}
								pagination={false}
								rowKey='productId'
							/>
							<div className={styles.totalAmount}>
								<strong>
									Tổng Tiền: {calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
								</strong>
							</div>
						</div>
					)}

					<Form.Item
						label='Trạng Thái'
						name='status'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
						initialValue='Chờ xác nhận'
					>
						<Select>
							<Select.Option value='Chờ xác nhận'>Chờ Xác Nhận</Select.Option>
							<Select.Option value='Đang giao'>Đang Giao</Select.Option>
							<Select.Option value='Hoàn thành'>Hoàn Thành</Select.Option>
							<Select.Option value='Hủy'>Hủy</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DonHangPage;
