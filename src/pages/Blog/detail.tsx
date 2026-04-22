import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, Empty, Row, Col, Spin, Avatar, Divider } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useBlogModel, BlogArticle } from '@/models/blog';
import styles from './detail.less';

const BlogDetail: React.FC<{ match: any }> = ({ match }) => {
	const { slug } = match.params;
	const model = useBlogModel();
	const [article, setArticle] = useState<BlogArticle | undefined>(undefined);
	const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const found = model.getArticleBySlug(slug);
		if (found) {
			setArticle(found);
			model.incrementViewCount(found.id);
			const related = model.getRelatedArticles(found.id, 3);
			setRelatedArticles(related);
		}
		setLoading(false);
	}, [slug, model.articles]);

	if (loading) {
		return <Spin />;
	}

	if (!article) {
		return <Empty description='Bài viết không tồn tại' />;
	}

	const handleBack = () => {
		history.goBack();
	};

	// Simple markdown to HTML conversion
	const renderContent = (content: string) => {
		let html = content;

		// Convert headers
		html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
		html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
		html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

		// Convert code blocks
		html = html.replace(/```([^`]*?)```/g, '<pre class="' + styles.codeBlock + '"><code>$1</code></pre>');

		// Convert inline code
		html = html.replace(/`([^`]+?)`/g, '<code class="' + styles.inlineCode + '">$1</code>');

		// Convert bold
		html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Convert italic
		html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

		// Convert lists
		html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
		html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

		// Convert paragraphs
		html = html
			.split('\n')
			.map((line: string) => {
				if (line.trim() && !line.startsWith('<')) {
					return '<p>' + line + '</p>';
				}
				return line;
			})
			.join('\n');

		return html;
	};

	return (
		<div className={styles.container}>
			{/* Back Button */}
			<Button type='text' icon={<ArrowLeftOutlined />} onClick={handleBack} className={styles.backButton}>
				Quay lại
			</Button>

			{/* Article Header */}
			<div className={styles.header}>
				<img src={article.avatar} alt={article.title} className={styles.headerImage} />
				<div className={styles.headerContent}>
					<h1>{article.title}</h1>
					<div className={styles.meta}>
						<Avatar size={40} src='https://i.pravatar.cc/150' />
						<div className={styles.metaInfo}>
							<div className={styles.author}>{article.author}</div>
							<div className={styles.metaDetails}>
								{new Date(article.createdAt).toLocaleDateString('vi-VN')}
								{' • '}
								<EyeOutlined /> {article.viewCount}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tags */}
			<div className={styles.tags}>
				{article.tags.map((tag) => (
					<Tag key={tag} color='blue'>
						{tag}
					</Tag>
				))}
			</div>

			<Divider />

			{/* Content */}
			<div className={styles.content}>
				<div
					dangerouslySetInnerHTML={{
						__html: renderContent(article.content),
					}}
				/>
			</div>

			<Divider />

			{/* Related Articles */}
			{relatedArticles.length > 0 && (
				<div className={styles.related}>
					<h2>📚 Bài Viết Liên Quan</h2>
					<Row gutter={[16, 16]}>
						{relatedArticles.map((related) => (
							<Col xs={24} sm={12} lg={8} key={related.id}>
								<Card
									hoverable
									onClick={() => history.push(`/blog/detail/${related.slug}`)}
									className={styles.relatedCard}
									cover={<img alt={related.title} src={related.avatar} />}
								>
									<Card.Meta
										title={related.title}
										description={
											<>
												<p>{related.summary}</p>
												<div className={styles.relatedMeta}>
													{new Date(related.createdAt).toLocaleDateString('vi-VN')} • <EyeOutlined />{' '}
													{related.viewCount}
												</div>
											</>
										}
									/>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default BlogDetail;
