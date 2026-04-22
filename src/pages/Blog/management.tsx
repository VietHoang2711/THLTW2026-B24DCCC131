import React, { useState } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Space,
	Tag,
	message,
	Popconfirm,
	Tabs,
	Row,
	Col,
	Divider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useBlogModel, BlogArticle, ArticleStatus } from '@/models/blog';
import TinyEditor from '@/components/TinyEditor';
import styles from './management.less';

const BlogManagement: React.FC = () => {
	const model = useBlogModel();
	const [form] = Form.useForm();

	// Article modal
	const [articleModalVisible, setArticleModalVisible] = useState(false);
	const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
	const [searchArticle, setSearchArticle] = useState('');
	const [filterStatus, setFilterStatus] = useState<ArticleStatus | 'all'>('all');

	// Tag modal
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [newTagInput, setNewTagInput] = useState('');
	const [editorContent, setEditorContent] = useState('');

	const statusColors: Record<ArticleStatus, string> = {
		Nháp: 'orange',
		'Đã đăng': 'green',
	};

	// Filter articles
	const filteredArticles = model.articles.filter((a) => {
		const matchSearch =
			searchArticle === '' ||
			a.title.toLowerCase().includes(searchArticle.toLowerCase()) ||
			a.slug.toLowerCase().includes(searchArticle.toLowerCase());

		const matchStatus = filterStatus === 'all' || a.status === filterStatus;

		return matchSearch && matchStatus;
	});

	// Article handlers
	const handleAddArticle = () => {
		setEditingArticleId(null);
		setSelectedTags([]);
		form.resetFields();
		setEditorContent('');
		setArticleModalVisible(true);
	};

	const handleEditArticle = (article: BlogArticle) => {
		setEditingArticleId(article.id);
		setSelectedTags(article.tags);
		form.setFieldsValue({
			title: article.title,
			slug: article.slug,
			summary: article.summary,
			content: article.content,
			avatar: article.avatar,
			status: article.status,
		});
		setEditorContent(article.content || '');
		setArticleModalVisible(true);
	};

	const handleSaveArticle = async () => {
		try {
			const values = await form.validateFields();

			if (selectedTags.length === 0) {
				message.error('Vui lòng thêm ít nhất một thẻ');
				return;
			}

			if (!editingArticleId) {
				// Check slug uniqueness
				if (model.isSlugExists(values.slug)) {
					message.error('Slug đã tồn tại');
					return;
				}

				model.addArticle({
					title: values.title,
					slug: values.slug,
					summary: values.summary,
					content: values.content,
					avatar: values.avatar,
					tags: selectedTags,
					status: values.status,
					viewCount: 0,
					author: 'Nguyễn Văn A',
				});
				message.success('Thêm bài viết thành công');
			} else {
				model.updateArticle(editingArticleId, {
					...values,
					tags: selectedTags,
				});
				message.success('Cập nhật bài viết thành công');
			}

			setArticleModalVisible(false);
			form.resetFields();
			setSelectedTags([]);
		} catch (err) {
			message.error('Vui lòng kiểm tra lại các trường bắt buộc');
		}
	};

	const handleDeleteArticle = (id: string) => {
		if (model.deleteArticle(id)) {
			message.success('Xóa bài viết thành công');
		}
	};

	// Tag handlers
	const handleAddTag = () => {
		if (newTagInput.trim() === '') {
			message.error('Vui lòng nhập tên thẻ');
			return;
		}

		if (model.tags.find((t) => t.name === newTagInput.trim())) {
			message.error('Thẻ đã tồn tại');
			return;
		}

		model.addTag(newTagInput.trim());
		setNewTagInput('');
		message.success('Thêm thẻ thành công');
	};

	const handleDeleteTag = (tagName: string) => {
		model.deleteTag(tagName);
		message.success('Xóa thẻ thành công');
	};

	// Article columns
	const articleColumns = [
		{
			title: 'Tiêu Đề',
			dataIndex: 'title',
			key: 'title',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'status',
			key: 'status',
			width: 100,
			render: (status: ArticleStatus) => <Tag color={statusColors[status]}>{status}</Tag>,
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			width: 150,
			render: (tags: string[]) => (
				<>
					{tags.slice(0, 2).map((tag) => (
						<Tag key={tag} color='blue'>
							{tag}
						</Tag>
					))}
					{tags.length > 2 && <Tag>+{tags.length - 2}</Tag>}
				</>
			),
		},
		{
			title: 'Lượt Xem',
			dataIndex: 'viewCount',
			key: 'viewCount',
			width: 80,
			sorter: (a: any, b: any) => a.viewCount - b.viewCount,
		},
		{
			title: 'Ngày Tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 100,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
			sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Hành Động',
			key: 'action',
			width: 150,
			render: (_: any, record: BlogArticle) => (
				<Space size='small'>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => handleEditArticle(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa bài viết'
						onConfirm={() => handleDeleteArticle(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
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
			<Tabs>
				<Tabs.TabPane tab='📝 Quản Lý Bài Viết' key='articles'>
					<Card>
						{/* Toolbar */}
						<div className={styles.toolbar}>
							<Space>
								<Input
									placeholder='Tìm theo tiêu đề hoặc slug'
									prefix={<SearchOutlined />}
									value={searchArticle}
									onChange={(e) => setSearchArticle(e.target.value)}
									style={{ width: 250 }}
									allowClear
								/>
								<Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
									<Select.Option value='all'>Tất Cả Trạng Thái</Select.Option>
									<Select.Option value='Nháp'>Nháp</Select.Option>
									<Select.Option value='Đã đăng'>Đã Đăng</Select.Option>
								</Select>
								<Button
									icon={<ReloadOutlined />}
									onClick={() => {
										setSearchArticle('');
										setFilterStatus('all');
									}}
								>
									Đặt Lại
								</Button>
								<Button type='primary' icon={<PlusOutlined />} onClick={handleAddArticle}>
									Thêm Bài Viết
								</Button>
							</Space>
						</div>

						{/* Table */}
						<Table
							columns={articleColumns}
							dataSource={filteredArticles}
							rowKey='id'
							pagination={{ pageSize: 10 }}
							scroll={{ x: 1200 }}
						/>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab='🏷️ Quản Lý Thẻ' key='tags'>
					<Card>
						{/* Add Tag */}
						<div className={styles.addTagSection}>
							<h3>Thêm Thẻ Mới</h3>
							<Space>
								<Input
									placeholder='Nhập tên thẻ'
									value={newTagInput}
									onChange={(e) => setNewTagInput(e.target.value)}
									onPressEnter={handleAddTag}
									style={{ width: 200 }}
								/>
								<Button type='primary' onClick={handleAddTag}>
									Thêm
								</Button>
							</Space>
						</div>

						<Divider />

						{/* Tags List */}
						<h3>Danh Sách Thẻ</h3>
						<Row gutter={[16, 16]}>
							{model.getAllTags().map((tag) => (
								<Col xs={24} sm={12} lg={8} key={tag.id}>
									<Card className={styles.tagCard}>
										<div className={styles.tagName}>{tag.name}</div>
										<div className={styles.tagCount}>{tag.count || 0} bài viết</div>
										<Popconfirm
											title={`Xóa thẻ "${tag.name}" - Sẽ xóa khỏi tất cả bài viết?`}
											onConfirm={() => handleDeleteTag(tag.name)}
											okText='Xóa'
											cancelText='Hủy'
										>
											<Button danger size='small' block style={{ marginTop: 12 }}>
												Xóa
											</Button>
										</Popconfirm>
									</Card>
								</Col>
							))}
						</Row>
					</Card>
				</Tabs.TabPane>
			</Tabs>

			{/* Article Modal */}
			<Modal
				title={editingArticleId ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết'}
				visible={articleModalVisible}
				onOk={handleSaveArticle}
				onCancel={() => {
					setArticleModalVisible(false);
					form.resetFields();
					setSelectedTags([]);
				}}
				width={900}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tiêu Đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
						<Input placeholder='Nhập tiêu đề bài viết' />
					</Form.Item>

					<Form.Item
						label='Slug'
						name='slug'
						rules={[
							{ required: true, message: 'Vui lòng nhập slug' },
							{
								validator: (_, value) => {
									if (value && !editingArticleId && model.isSlugExists(value)) {
										return Promise.reject(new Error('Slug đã tồn tại'));
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input placeholder='VD: bai-viet-hay' />
					</Form.Item>

					<Form.Item label='Tóm Tắt' name='summary' rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
						<Input.TextArea rows={2} placeholder='Nhập tóm tắt bài viết' />
					</Form.Item>

					<Form.Item
						label='Nội Dung (Markdown)'
						name='content'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
					>
						<TinyEditor
							value={editorContent}
							onChange={(v) => {
								setEditorContent(v);
								form.setFieldsValue({ content: v });
							}}
							height={300}
						/>
					</Form.Item>

					<Form.Item
						label='Ảnh Đại Diện (URL)'
						name='avatar'
						rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
					>
						<Input placeholder='https://example.com/image.jpg' />
					</Form.Item>

					<Form.Item label='Thẻ' required>
						<Select
							mode='multiple'
							placeholder='Chọn hoặc tạo thẻ mới'
							value={selectedTags}
							onChange={setSelectedTags}
							options={model.getAllTags().map((tag) => ({
								label: tag.name,
								value: tag.name,
							}))}
						/>
					</Form.Item>

					<Form.Item
						label='Trạng Thái'
						name='status'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
						initialValue='Nháp'
					>
						<Select>
							<Select.Option value='Nháp'>Nháp</Select.Option>
							<Select.Option value='Đã đăng'>Đã Đăng</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default BlogManagement;
