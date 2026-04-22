import React, { useState, useMemo, useEffect } from 'react';
import { Card, Input, Tag, Pagination, Row, Col, Empty, Button } from 'antd';
import { SearchOutlined, ReadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useBlogModel } from '@/models/blog';
import styles from './index.less';

const ARTICLES_PER_PAGE = 9;

const BlogHome: React.FC = () => {
	const model = useBlogModel();
	const [searchText, setSearchText] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [debouncedSearch, setDebouncedSearch] = useState('');

	// Debounce search 300ms
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchText);
			setCurrentPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchText]);

	const filteredArticles = useMemo(() => {
		let result = model.getPublishedArticles();

		if (debouncedSearch) {
			result = result.filter(
				(a) =>
					a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
					a.summary.toLowerCase().includes(debouncedSearch.toLowerCase()),
			);
		}

		if (selectedTag) {
			result = result.filter((a) => a.tags.includes(selectedTag));
		}

		return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [model.articles, debouncedSearch, selectedTag]);

	const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
	const paginatedArticles = filteredArticles.slice(
		(currentPage - 1) * ARTICLES_PER_PAGE,
		currentPage * ARTICLES_PER_PAGE,
	);

	const allTags = useMemo(() => model.getAllTags().filter((t) => t.count! > 0), [model.tags, model.articles]);

	const handleTagClick = (tag: string) => {
		setSelectedTag(selectedTag === tag ? null : tag);
		setCurrentPage(1);
	};

	const handleArticleClick = (slug: string) => {
		history.push(`/blog/detail/${slug}`);
	};

	return (
		<div className={styles.container}>
			{/* Header */}
			<div className={styles.header}>
				<h1>📝 Blog Cá Nhân</h1>
				<p>Chia sẻ kiến thức và kinh nghiệm</p>
			</div>

			{/* Search */}
			<div className={styles.searchSection}>
				<Input
					prefix={<SearchOutlined />}
					placeholder='Tìm kiếm bài viết...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					className={styles.searchInput}
					allowClear
				/>
			</div>

			{/* Tags Filter */}
			<div className={styles.tagsSection}>
				<div className={styles.tagsLabel}>Thẻ:</div>
				<div className={styles.tagsList}>
					{allTags.map((tag) => (
						<Tag
							key={tag.id}
							onClick={() => handleTagClick(tag.name)}
							className={`${styles.tag} ${selectedTag === tag.name ? styles.activeTag : ''}`}
							style={{ cursor: 'pointer' }}
						>
							{tag.name} ({tag.count})
						</Tag>
					))}
					{selectedTag && (
						<Button
							type='text'
							size='small'
							onClick={() => {
								setSelectedTag(null);
								setCurrentPage(1);
							}}
						>
							Xóa lọc
						</Button>
					)}
				</div>
			</div>

			{/* Articles Grid */}
			{paginatedArticles.length === 0 ? (
				<Empty description='Không tìm thấy bài viết nào' />
			) : (
				<>
					<Row gutter={[24, 24]} className={styles.articlesGrid}>
						{paginatedArticles.map((article) => (
							<Col xs={24} sm={12} lg={8} key={article.id}>
								<Card
									hoverable
									className={styles.articleCard}
									cover={
										<img
											alt={article.title}
											src={article.avatar}
											className={styles.cardImage}
											onClick={() => handleArticleClick(article.slug)}
										/>
									}
									onClick={() => handleArticleClick(article.slug)}
								>
									<div className={styles.cardContent}>
										<h3 className={styles.cardTitle}>{article.title}</h3>
										<p className={styles.cardSummary}>{article.summary}</p>

										<div className={styles.cardTags}>
											{article.tags.slice(0, 2).map((tag) => (
												<Tag
													key={tag}
													color='blue'
													onClick={(e) => {
														e.stopPropagation();
														handleTagClick(tag);
													}}
													style={{ cursor: 'pointer' }}
												>
													{tag}
												</Tag>
											))}
											{article.tags.length > 2 && <Tag>+{article.tags.length - 2}</Tag>}
										</div>

										<div className={styles.cardMeta}>
											<span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
											<span> • </span>
											<span>{article.author}</span>
											<span> • </span>
											<span>
												<ReadOutlined /> {article.viewCount}
											</span>
										</div>
									</div>
								</Card>
							</Col>
						))}
					</Row>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className={styles.pagination}>
							<Pagination
								current={currentPage}
								total={filteredArticles.length}
								pageSize={ARTICLES_PER_PAGE}
								onChange={setCurrentPage}
								showSizeChanger={false}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default BlogHome;
