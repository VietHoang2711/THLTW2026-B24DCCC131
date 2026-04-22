import React from 'react';
import { Card, Row, Col, Avatar, Tag, Button, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from './about.less';

const BlogAbout: React.FC = () => {
	const skills = [
		'React.js',
		'TypeScript',
		'Node.js',
		'JavaScript',
		'Web Development',
		'UI/UX Design',
		'CSS/LESS',
		'REST API',
		'Database Design',
		'Git',
	];

	return (
		<div className={styles.container}>
			<Card className={styles.aboutCard}>
				<Row gutter={[40, 40]}>
					{/* Avatar */}
					<Col xs={24} sm={8} className={styles.avatarCol}>
						<div className={styles.avatarSection}>
							<Avatar
								size={200}
								src='https://cdn.24h.com.vn/upload/2-2021/images/2021-06-26/42725836-adf9-4fc7-8764-9f671109ee3a-1624678195-502-width600height400.jpeg'
								className={styles.avatar}
							/>
							<h2>Trần Việt Hoàng</h2>
							<p className={styles.subtitle}>Web Developer & Content Creator</p>
						</div>
					</Col>

					{/* Bio */}
					<Col xs={24} sm={16}>
						<div className={styles.bioSection}>
							<h2>Về Tôi</h2>
							<p>
								Xin chào! Tôi là một web developer passionate với kinh nghiệm hơn 5 năm trong việc phát triển các ứng
								dụng web hiện đại. Tôi yêu thích chia sẻ kiến thức và giúp đỡ cộng đồng developer.
							</p>
							<p>
								Trên blog này, tôi chia sẻ những bài viết về React, TypeScript, Node.js và nhiều chủ đề khác liên quan
								đến web development. Mục tiêu của tôi là giúp các bạn học lập trình một cách dễ dàng và thực tế.
							</p>

							{/* Skills */}
							<div className={styles.skillsSection}>
								<h3>💡 Kỹ Năng</h3>
								<div className={styles.skills}>
									{skills.map((skill) => (
										<Tag key={skill} color='blue' className={styles.skillTag}>
											{skill}
										</Tag>
									))}
								</div>
							</div>

							{/* Social Links */}
							<div className={styles.socialSection}>
								<h3>🔗 Liên Kết</h3>
								<Space size='large' className={styles.socialLinks}>
									<Button
										type='primary'
										icon={<GithubOutlined />}
										onClick={() => window.open('https://github.com/VietHoang2711')}
									>
										GitHub
									</Button>
									<Button
										type='primary'
										icon={<LinkedinOutlined />}
										onClick={() =>
											window.open('https://www.linkedin.com/in/tr%E1%BA%A7n-vi%E1%BB%87t-ho%C3%A0ng-7b0a12354/')
										}
									>
										LinkedIn
									</Button>
									<Button
										type='primary'
										icon={<FacebookOutlined />}
										onClick={() => window.open('https://web.facebook.com/viet.hoang.477526/')}
									>
										Facebook
									</Button>
									<Button
										type='primary'
										icon={<MailOutlined />}
										onClick={() => (window.location.href = 'mailto:viethoang2k6123@gmail.com')}
									>
										Email
									</Button>
								</Space>
							</div>

							{/* Experience */}
							<div className={styles.experienceSection}>
								<h3>📊 Thống Kê</h3>
								<Row gutter={[16, 16]}>
									<Col xs={12} sm={6}>
										<Card className={styles.statCard}>
											<div className={styles.statNumber}>5+</div>
											<div className={styles.statLabel}>Năm Kinh Nghiệm</div>
										</Card>
									</Col>
									<Col xs={12} sm={6}>
										<Card className={styles.statCard}>
											<div className={styles.statNumber}>50+</div>
											<div className={styles.statLabel}>Dự Án</div>
										</Card>
									</Col>
									<Col xs={12} sm={6}>
										<Card className={styles.statCard}>
											<div className={styles.statNumber}>10+</div>
											<div className={styles.statLabel}>Bài Viết</div>
										</Card>
									</Col>
									<Col xs={12} sm={6}>
										<Card className={styles.statCard}>
											<div className={styles.statNumber}>1000+</div>
											<div className={styles.statLabel}>Độc Giả</div>
										</Card>
									</Col>
								</Row>
							</div>
						</div>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default BlogAbout;
