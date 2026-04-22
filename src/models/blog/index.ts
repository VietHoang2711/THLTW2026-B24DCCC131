import { useState, useEffect } from 'react';

export type ArticleStatus = 'Nháp' | 'Đã đăng';

export interface BlogArticle {
	id: string;
	slug: string;
	title: string;
	summary: string;
	content: string;
	avatar: string;
	tags: string[];
	status: ArticleStatus;
	viewCount: number;
	author: string;
	createdAt: string;
	updatedAt: string;
}

export interface BlogTag {
	id: string;
	name: string;
	count?: number;
}

export interface UseBlogModel {
	articles: BlogArticle[];
	tags: BlogTag[];
	addArticle: (article: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
	updateArticle: (id: string, updates: Partial<Omit<BlogArticle, 'id' | 'createdAt'>>) => BlogArticle | undefined;
	deleteArticle: (id: string) => boolean;
	getArticleBySlug: (slug: string) => BlogArticle | undefined;
	getArticleById: (id: string) => BlogArticle | undefined;
	incrementViewCount: (id: string) => void;
	getPublishedArticles: () => BlogArticle[];
	searchArticles: (keyword: string) => BlogArticle[];
	filterByTag: (tag: string) => BlogArticle[];
	getRelatedArticles: (articleId: string, limit?: number) => BlogArticle[];
	getAllTags: () => BlogTag[];
	getTagCount: (tagName: string) => number;
	addTag: (tagName: string) => void;
	deleteTag: (tagName: string) => void;
	isSlugExists: (slug: string) => boolean;
}

const ARTICLES_STORAGE_KEY = 'blog_articles';
const TAGS_STORAGE_KEY = 'blog_tags';

// Mock articles
const MOCK_ARTICLES: BlogArticle[] = [
	{
		id: '1',
		slug: 'gioi-thieu-reactjs',
		title: 'Giới Thiệu React.js',
		summary: 'React.js là một thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng...',
		content: `# Giới Thiệu React.js

React.js là một thư viện JavaScript mạnh mẽ được phát triển bởi Facebook. Nó giúp bạn xây dựng giao diện người dùng (UI) một cách hiệu quả và dễ bảo trì.

## Các Ưu Điểm Của React

1. **Component-Based**: React sử dụng kiến trúc component, giúp tái sử dụng code dễ dàng
2. **Virtual DOM**: Cải thiện hiệu suất bằng cách cập nhật chỉ các phần thay đổi
3. **Declarative**: Bạn mô tả UI mong muốn, React sẽ lo phần còn lại
4. **Large Ecosystem**: Có nhiều thư viện hỗ trợ như React Router, Redux, etc.

## Bắt Đầu Với React

\`\`\`javascript
import React from 'react';

function App() {
  return <h1>Xin chào React!</h1>;
}

export default App;
\`\`\`

React là nền tảng tuyệt vời để bắt đầu học web development.`,
		avatar: 'https://th.bing.com/th/id/OIP.fBEfe4CJ2dAv2G4EWlgHKgHaEo?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['React', 'JavaScript', 'Frontend'],
		status: 'Đã đăng',
		viewCount: 245,
		author: 'Nguyễn Văn A',
		createdAt: '2024-04-10',
		updatedAt: '2024-04-10',
	},
	{
		id: '2',
		slug: 'typescript-beginner-guide',
		title: 'TypeScript Cho Người Mới Bắt Đầu',
		summary: 'Hướng dẫn chi tiết giúp bạn làm quen với TypeScript từ cơ bản...',
		content: `# TypeScript Cho Người Mới Bắt Đầu

TypeScript là một siêu tập hợp của JavaScript, bổ sung tính năng kiểu tĩnh (static typing).

## Tại Sao Dùng TypeScript?

- **Type Safety**: Bắt lỗi tại thời gian phát triển
- **Better IDE Support**: Autocomplete tốt hơn
- **Self-Documenting**: Code dễ hiểu hơn

## Cơ Bản Về Types

\`\`\`typescript
let name: string = 'John';
let age: number = 25;
let isActive: boolean = true;
\`\`\`

TypeScript giúp bạn viết code an toàn hơn!`,
		avatar: 'https://th.bing.com/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['TypeScript', 'JavaScript'],
		status: 'Đã đăng',
		viewCount: 189,
		author: 'Nguyễn Văn A',
		createdAt: '2024-04-08',
		updatedAt: '2024-04-08',
	},
	{
		id: '3',
		slug: 'nodejs-api-tutorial',
		title: 'Xây Dựng REST API Với Node.js',
		summary: 'Hướng dẫn từng bước xây dựng REST API sử dụng Node.js và Express...',
		content: `# Xây Dựng REST API Với Node.js

Node.js cho phép bạn chạy JavaScript trên máy chủ. Express là framework phổ biến nhất.

## Cài Đặt

\`\`\`bash
npm init -y
npm install express
\`\`\`

## Tạo Server Cơ Bản

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello API!' });
});

app.listen(3000, () => {
  console.log('Server chạy tại port 3000');
});
\`\`\`

Bắt đầu xây dựng API của bạn ngay hôm nay!`,
		avatar: 'https://th.bing.com/th/id/OIP.fBEfe4CJ2dAv2G4EWlgHKgHaEo?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Node.js', 'Backend', 'API'],
		status: 'Đã đăng',
		viewCount: 312,
		author: 'Nguyễn Văn A',
		createdAt: '2024-04-05',
		updatedAt: '2024-04-05',
	},
	{
		id: '4',
		slug: 'web-performance-tips',
		title: '10 Mẹo Tối Ưu Hiệu Suất Web',
		summary: 'Những kỹ thuật giúp trang web của bạn tải nhanh hơn...',
		content: `# 10 Mẹo Tối Ưu Hiệu Suất Web

1. Nén hình ảnh
2. Sử dụng CDN
3. Minify CSS/JS
4. Lazy loading
5. Caching strategies

Implement những mẹo này để website của bạn chạy nhanh hơn!`,
		avatar: 'https://th.bing.com/th/id/OIP.fBEfe4CJ2dAv2G4EWlgHKgHaEo?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Performance', 'Web'],
		status: 'Đã đăng',
		viewCount: 156,
		author: 'Nguyễn Văn A',
		createdAt: '2024-04-01',
		updatedAt: '2024-04-01',
	},
	{
		id: '5',
		slug: 'css-flexbox-guide',
		title: 'Hướng Dẫn CSS Flexbox Từ Cơ Bản Đến Nâng Cao',
		summary: 'Tìm hiểu cách sử dụng CSS Flexbox để tạo layout responsive dễ dàng...',
		content: `# CSS Flexbox - Hướng Dẫn Toàn Diện

CSS Flexbox là công cụ mạnh mẽ để tạo layout linh hoạt.

## Các Thuộc Tính Chính

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
\`\`\`

## Ứng Dụng Thực Tế
- Centered layouts
- Equal-width columns
- Mobile-first design

Flexbox từng bước thay đổi cách chúng ta code CSS!`,
		avatar: 'https://th.bing.com/th/id/OIP.fBEfe4CJ2dAv2G4EWlgHKgHaEo?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['CSS', 'Frontend', 'Web Design'],
		status: 'Đã đăng',
		viewCount: 203,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-28',
		updatedAt: '2024-03-28',
	},
	{
		id: '6',
		slug: 'javascript-es6-features',
		title: 'Các Tính Năng ES6 Mà Mọi Developer Cần Biết',
		summary: 'Khám phá các tính năng hiện đại trong JavaScript ES6 và cách sử dụng chúng...',
		content: `# JavaScript ES6 - Những Tính Năng Bắt Buộc

ES6 (ECMAScript 2015) đã mang lại nhiều cải tiến cho JavaScript.

## Các Tính Năng Quan Trọng

1. **Arrow Functions**: \`const sum = (a, b) => a + b;\`
2. **Destructuring**: \`const { name, age } = person;\`
3. **Template Literals**: \`\`const msg = \\\`Hello \${name}\\\`;\`\`
4. **Promises**: Xử lý bất đồng bộ tốt hơn
5. **Classes**: Cú pháp OOP chuẩn

Nắm vững ES6 để code JavaScript hiện đại!`,
		avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
		tags: ['JavaScript', 'Frontend', 'ES6'],
		status: 'Đã đăng',
		viewCount: 278,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-25',
		updatedAt: '2024-03-25',
	},
	{
		id: '7',
		slug: 'react-hooks-deep-dive',
		title: 'React Hooks - Khám Phá Chi Tiết',
		summary: 'Hiểu rõ về Hooks trong React và cách tối ưu sử dụng chúng...',
		content: `# React Hooks - Deep Dive

Hooks là tính năng cho phép bạn sử dụng state trong functional components.

## Hooks Phổ Biến

\`\`\`javascript
import { useState, useEffect, useContext } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## Best Practices
- Chỉ gọi Hooks ở top level
- Tạo custom hooks cho logic tái sử dụng
- Tối ưu với dependencies array

Hooks làm React development trở nên mạnh mẽ hơn!`,
		avatar: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500',
		tags: ['React', 'Hooks', 'Frontend'],
		status: 'Đã đăng',
		viewCount: 334,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-22',
		updatedAt: '2024-03-22',
	},
	{
		id: '8',
		slug: 'web-security-basics',
		title: 'An Ninh Web - Những Điều Cơ Bản Mà Bạn Phải Biết',
		summary: 'Học về các vấn đề an ninh web phổ biến và cách bảo vệ ứng dụng...',
		content: `# Web Security - Các Nguyên Tắc Cơ Bản

An ninh web là điều không thể bỏ qua khi phát triển ứng dụng.

## Các Mối Đe Dọa Phổ Biến

1. **XSS (Cross-Site Scripting)**
2. **CSRF (Cross-Site Request Forgery)**
3. **SQL Injection**
4. **HTTPS/SSL**

## Biện Pháp Bảo Vệ

- Validate tất cả inputs
- Sử dụng HTTPS
- Implement CORS correctly
- Regular security updates

Bảo vệ ứng dụng của bạn từ hôm nay!`,
		avatar: 'https://images.unsplash.com/photo-1516321318423-f06c6a504541?w=500',
		tags: ['Security', 'Web', 'Backend'],
		status: 'Đã đăng',
		viewCount: 187,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-20',
		updatedAt: '2024-03-20',
	},
	{
		id: '9',
		slug: 'docker-beginners',
		title: 'Docker Cho Người Mới Bắt Đầu',
		summary: 'Hướng dẫn bước đầu làm quen với Docker và containerization...',
		content: `# Docker - Tổng Quan Cho Người Mới Bắt Đầu

Docker cho phép bạn đóng gói ứng dụng vào containers.

## Lợi Ích Của Docker

- **Consistency**: Chạy giống nhau ở mọi nơi
- **Isolation**: Tách biệt dependencies
- **Scalability**: Dễ scale ứng dụng

## Cơ Bản Với Docker

\`\`\`bash
docker build -t myapp .
docker run -p 3000:3000 myapp
\`\`\`

Bắt đầu containerize ứng dụng của bạn!`,
		avatar: 'https://images.unsplash.com/photo-1627398242454-45a570e2c1d7?w=500',
		tags: ['Docker', 'DevOps', 'Backend'],
		status: 'Đã đăng',
		viewCount: 156,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-18',
		updatedAt: '2024-03-18',
	},
	{
		id: '10',
		slug: 'git-workflow-guide',
		title: 'Git Workflow - Quy Trình Làm Việc Hiệu Quả',
		summary: 'Tìm hiểu các best practices trong Git và workflow chuyên nghiệp...',
		content: `# Git Workflow - Làm Việc Nhóm Hiệu Quả

Sử dụng Git đúng cách để tối ưu workflow.

## Git Flow Strategy

\`\`\`
main -> develop -> feature/xyz
\`\`\`

## Các Bước Cơ Bản

1. \`git checkout -b feature/new-feature\`
2. Commit changes với message rõ ràng
3. \`git push origin feature/new-feature\`
4. Tạo Pull Request
5. Code review và merge

## Best Practices
- Commit messages phải rõ ràng
- Rebase trước khi merge
- Xóa branches cũ

Workflow Git tốt = Team hiệu quả!`,
		avatar: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500',
		tags: ['Git', 'DevOps', 'Tools'],
		status: 'Đã đăng',
		viewCount: 241,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-15',
		updatedAt: '2024-03-15',
	},
	{
		id: '11',
		slug: 'database-design-tips',
		title: 'Tips Thiết Kế Cơ Sở Dữ Liệu Tốt',
		summary: 'Các nguyên tắc cơ bản để thiết kế database hiệu quả và an toàn...',
		content: `# Thiết Kế Database - Những Nguyên Tắc Cơ Bản

Thiết kế database tốt là nền tảng của ứng dụng.

## Quy Tắc Normalization

1. **1NF**: Mỗi field chứa dữ liệu atomic
2. **2NF**: Loại bỏ partial dependencies
3. **3NF**: Loại bỏ transitive dependencies

## Các Điều Cần Nhớ

- Chọn data types phù hợp
- Thêm indexes cho queries hay dùng
- Backup strategy là bắt buộc
- Validate data ở DB level

\`\`\`sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP
);
\`\`\`

Database tốt = Ứng dụng ổn định!`,
		avatar: 'https://images.unsplash.com/photo-1516321318423-f06c6a504541?w=500',
		tags: ['Database', 'SQL', 'Backend'],
		status: 'Đã đăng',
		viewCount: 198,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-12',
		updatedAt: '2024-03-12',
	},
	{
		id: '12',
		slug: 'testing-with-jest',
		title: 'Unit Testing Với Jest - Hướng Dẫn Toàn Diện',
		summary: 'Học cách viết unit tests hiệu quả với Jest framework...',
		content: `# Testing Với Jest

Unit testing là phần không thể thiếu trong phát triển phần mềm.

## Cài Đặt Jest

\`\`\`bash
npm install --save-dev jest
\`\`\`

## Viết Test Cơ Bản

\`\`\`javascript
describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
});
\`\`\`

## Best Practices
- Test logic, không implementation
- Mỗi test nên independent
- Viết tests cùng lúc với code
- Đạt 80%+ code coverage

Jest giúp code của bạn tin cậy hơn!`,
		avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
		tags: ['Testing', 'Jest', 'Frontend'],
		status: 'Đã đăng',
		viewCount: 267,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-10',
		updatedAt: '2024-03-10',
	},
	{
		id: '13',
		slug: 'mobile-first-design',
		title: 'Mobile First Design - Thiết Kế Cho Thiết Bị Di Động',
		summary: 'Nguyên tắc thiết kế mobile first và cách implement responsive design...',
		content: `# Mobile First Design Approach

Mobile first có nghĩa là thiết kế cho mobile trước, sau đó scale lên desktop.

## Ưu Điểm Của Mobile First

1. **Performance**: Tập trung vào essentials
2. **User Experience**: Phù hợp với hầu hết users
3. **Scalability**: Dễ mở rộng

## Responsive Breakpoints

\`\`\`css
/* Mobile: 0px - 480px */
/* Tablet: 481px - 768px */
/* Desktop: 769px+ */

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
\`\`\`

## Mobile First Tips
- Simplify content
- Touch-friendly buttons
- Optimize images
- Test thực tế trên devices

Mobile users là phần lớn, thiết kế cho họ!`,
		avatar: 'https://th.bing.com/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Mobile', 'Design', 'Frontend'],
		status: 'Đã đăng',
		viewCount: 312,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-08',
		updatedAt: '2024-03-08',
	},
	{
		id: '14',
		slug: 'vuejs-introduction',
		title: 'Vue.js - Giới Thiệu Framework JavaScript',
		summary: 'Tìm hiểu Vue.js, framework lựa chọn của nhiều developers...',
		content: `# Vue.js - Bắt Đầu Với Một Framework Progressive

Vue.js là framework JavaScript linh hoạt và dễ học.

## Cài Đặt Vue

\`\`\`bash
npm create vite@latest my-app -- --template vue
cd my-app
npm run dev
\`\`\`

## Cơ Bản Về Vue

\`\`\`vue
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return { message: 'Hello Vue!', count: 0 }
  }
}
</script>
\`\`\`

## Tại Sao Chọn Vue?
- Easy to learn
- Good documentation
- Progressive framework
- Active community

Vue giúp xây dựng UIs một cách elegant!`,
		avatar: 'https://th.bing.com/th/id/OIP.ALPOUMPpYUXKoEsf4feHVQHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Vue.js', 'Frontend', 'JavaScript'],
		status: 'Đã đăng',
		viewCount: 289,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-05',
		updatedAt: '2024-03-05',
	},
	{
		id: '15',
		slug: 'graphql-introduction',
		title: 'GraphQL - Thay Thế Cho REST API',
		summary: 'Khám phá GraphQL và lợi ích nó mang đến cho API development...',
		content: `# GraphQL - Query Language Cho APIs

GraphQL là giải pháp mở rộng quyền năng cho APIs.

## Sự Khác Biệt So Với REST

| GraphQL | REST |
|---------|------|
| Single endpoint | Multiple endpoints |
| Request exactly what you need | Fixed response |
| Strong typing | No built-in types |

## Query Cơ Bản

\`\`\`graphql
query {
  user(id: "1") {
    name
    email
    posts {
      title
    }
  }
}
\`\`\`

## Setup Apollo Server

\`\`\`javascript
import { ApolloServer } from 'apollo-server';

const typeDefs = \`
  type Query {
    hello: String
  }
\`;
\`\`\`

GraphQL mang tính linh hoạt mới cho APIs!`,
		avatar: 'https://th.bing.com/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['GraphQL', 'API', 'Backend'],
		status: 'Đã đăng',
		viewCount: 224,
		author: 'Nguyễn Văn A',
		createdAt: '2024-03-02',
		updatedAt: '2024-03-02',
	},
	{
		id: '16',
		slug: 'aws-basics-for-developers',
		title: 'AWS Cho Developers - Những Kiến Thức Cơ Bản',
		summary: 'Giới thiệu các dịch vụ AWS và cách bắt đầu sử dụng chúng...',
		content: `# AWS - Cloud Computing Platform

AWS là nền tảng cloud computing hàng đầu.

## Các Dịch Vụ Quan Trọng

1. **EC2**: Virtual machines
2. **S3**: Object storage
3. **RDS**: Managed databases
4. **Lambda**: Serverless computing
5. **CloudFront**: CDN

## Lợi Ích Của AWS

- **Scalability**: Tự động scale theo nhu cầu
- **High Availability**: Redundancy built-in
- **Cost Effective**: Pay as you go
- **Global Infrastructure**: Nhiều regions

## Bắt Đầu

1. Tạo AWS account
2. Khám phá free tier
3. Tìm hiểu IAM
4. Deploy ứng dụng

AWS là tương lai của cloud development!`,
		avatar: 'https://images.unsplash.com/photo-1627398242454-45a570e2c1d7?w=500',
		tags: ['AWS', 'Cloud', 'DevOps'],
		status: 'Đã đăng',
		viewCount: 201,
		author: 'Nguyễn Văn A',
		createdAt: '2024-02-28',
		updatedAt: '2024-02-28',
	},
	{
		id: '17',
		slug: 'machine-learning-introduction',
		title: 'Machine Learning - Giới Thiệu Chi Tiết',
		summary: 'Tìm hiểu cơ bản về Machine Learning và các ứng dụng thực tế...',
		content: `# Machine Learning - Bước Đầu Vào Thế Giới AI

Machine Learning là công nghệ biến đổi thế giới hiện đại.

## Các Loại ML

1. **Supervised Learning**: Label dữ liệu
   - Regression
   - Classification

2. **Unsupervised Learning**: Không label
   - Clustering
   - Dimensionality reduction

3. **Reinforcement Learning**: Học từ feedback

## Quy Trình ML

1. Collect data
2. Preprocess data
3. Choose model
4. Train model
5. Evaluate
6. Deploy

## Tools Phổ Biến

- Python
- TensorFlow
- scikit-learn
- PyTorch

Machine Learning là kỹ năng tương lai!`,
		avatar: 'https://th.bing.com/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Machine Learning', 'AI', 'Python'],
		status: 'Đã đăng',
		viewCount: 156,
		author: 'Nguyễn Văn A',
		createdAt: '2024-02-25',
		updatedAt: '2024-02-25',
	},
	{
		id: '18',
		slug: 'blockchain-fundamentals',
		title: 'Blockchain - Công Nghệ Cơ Bản',
		summary: 'Hiểu rõ công nghệ blockchain và các ứng dụng của nó...',
		content: `# Blockchain - Tương Lai Của Web3

Blockchain là công nghệ nền tảng của web3.

## Khái Niệm Cơ Bản

- **Block**: Chứa dữ liệu và hash
- **Chain**: Liên kết các blocks
- **Decentralized**: Không có server trung tâm

## Cách Hoạt Động

1. Transaction được phát sóng
2. Miners/validators xác thực
3. Block được thêm vào chain
4. Smart contracts thực hiện

## Ứng Dụng

- Cryptocurrency (Bitcoin, Ethereum)
- Smart Contracts
- IoT
- Supply Chain

## Lợi Ích

- Transparent
- Secure
- Immutable
- Decentralized

Blockchain định hình lại tương lai của technology!`,
		avatar: 'https://images.unsplash.com/photo-1622365131055-0fdbb7fef0ae?w=500',
		tags: ['Blockchain', 'Web3', 'Crypto'],
		status: 'Đã đăng',
		viewCount: 178,
		author: 'Nguyễn Văn A',
		createdAt: '2024-02-22',
		updatedAt: '2024-02-22',
	},
	{
		id: '19',
		slug: 'web-accessibility-wcag',
		title: 'Web Accessibility - Làm Web Dễ Sử Dụng Cho Tất Cả',
		summary: 'Tìm hiểu WCAG standards và cách tạo website accessible...',
		content: `# Web Accessibility - WCAG 2.1 Guidelines

Web accessibility đảm bảo người dùng có khuyếtật có thể dùng website.

## Tại Sao Là Quan Trọng

- 15% dân số có khuyếtật
- Legal requirement ở nhiều quốc gia
- Good SEO practice
- Better UX cho tất cả

## WCAG 4 Principles (POUR)

1. **Perceivable**: Người dùng có thể thấy/nghe
2. **Operable**: Có thể dùng keyboard
3. **Understandable**: Content dễ hiểu
4. **Robust**: Tương thích với assistive tech

## Cách Implement

\`\`\`html
<!-- Good semantic HTML -->
<button aria-label="Close menu">X</button>
<img alt="Description of image" src="...">
<input aria-required="true" type="email">
\`\`\`

## Tools Để Check
- axe DevTools
- WAVE
- Lighthouse
- Screen readers

Accessibility = Inclusion cho tất cả!`,
		avatar: 'https://th.bing.com/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?w=269&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
		tags: ['Accessibility', 'WCAG', 'Frontend'],
		status: 'Đã đăng',
		viewCount: 142,
		author: 'Nguyễn Văn A',
		createdAt: '2024-02-20',
		updatedAt: '2024-02-20',
	},
];

const MOCK_TAGS: BlogTag[] = [
	{ id: '1', name: 'React', count: 2 },
	{ id: '2', name: 'JavaScript', count: 2 },
	{ id: '3', name: 'Frontend', count: 6 },
	{ id: '4', name: 'TypeScript', count: 1 },
	{ id: '5', name: 'Node.js', count: 1 },
	{ id: '6', name: 'Backend', count: 3 },
	{ id: '7', name: 'API', count: 2 },
	{ id: '8', name: 'Performance', count: 1 },
	{ id: '9', name: 'Web', count: 3 },
	{ id: '10', name: 'CSS', count: 1 },
	{ id: '11', name: 'Web Design', count: 1 },
	{ id: '12', name: 'ES6', count: 1 },
	{ id: '13', name: 'Hooks', count: 1 },
	{ id: '14', name: 'Security', count: 1 },
	{ id: '15', name: 'Docker', count: 1 },
	{ id: '16', name: 'DevOps', count: 2 },
	{ id: '17', name: 'Git', count: 1 },
	{ id: '18', name: 'Tools', count: 1 },
	{ id: '19', name: 'Database', count: 1 },
	{ id: '20', name: 'SQL', count: 1 },
	{ id: '21', name: 'Testing', count: 1 },
	{ id: '22', name: 'Jest', count: 1 },
	{ id: '23', name: 'Mobile', count: 1 },
	{ id: '24', name: 'Vue.js', count: 1 },
	{ id: '25', name: 'GraphQL', count: 1 },
	{ id: '26', name: 'AWS', count: 1 },
	{ id: '27', name: 'Cloud', count: 1 },
	{ id: '28', name: 'Machine Learning', count: 1 },
	{ id: '29', name: 'AI', count: 1 },
	{ id: '30', name: 'Python', count: 1 },
	{ id: '31', name: 'Blockchain', count: 1 },
	{ id: '32', name: 'Web3', count: 1 },
	{ id: '33', name: 'Crypto', count: 1 },
	{ id: '34', name: 'Accessibility', count: 1 },
	{ id: '35', name: 'WCAG', count: 1 },
];

// Simple markdown -> HTML converter (keeps HTML if already HTML)
const isLikelyMarkdown = (s: string) => {
	if (!s) return false;
	const mdSignals = /(^#\s)|(^##\s)|(^###\s)|(```)|(^-\s)/m;
	// If it already contains HTML tags, treat as HTML
	const hasHtml = /<[^>]+>/m.test(s);
	return !hasHtml && mdSignals.test(s);
};

const markdownToHtml = (content: string) => {
	if (!content) return '';
	if (!isLikelyMarkdown(content)) return content;

	let html = content;
	html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
	html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
	html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');
	html = html.replace(/```([^`]*?)```/gs, '<pre class="code-block"><code>$1</code></pre>');
	html = html.replace(/`([^`]+?)`/g, '<code class="inline-code">$1</code>');
	html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
	// Lists
	html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
	// wrap consecutive <li> into <ul>
	html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (m) => {
		if (/^<li>/m.test(m)) return `<ul>${m}</ul>`;
		return m;
	});
	// paragraphs for plain lines
	html = html
		.split('\n')
		.map((line) => {
			if (line.trim() && !line.trim().startsWith('<')) {
				return `<p>${line}</p>`;
			}
			return line;
		})
		.join('\n');
	return html;
};

export const useBlogModel = (): UseBlogModel => {
	const [articles, setArticles] = useState<BlogArticle[]>([]);
	const [tags, setTags] = useState<BlogTag[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		const savedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
		const savedTags = localStorage.getItem(TAGS_STORAGE_KEY);

		setArticles(savedArticles ? JSON.parse(savedArticles) : MOCK_ARTICLES);
		setTags(savedTags ? JSON.parse(savedTags) : MOCK_TAGS);
	}, []);

	// Save to localStorage
	useEffect(() => {
		if (articles.length > 0) {
			localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
		}
	}, [articles]);

	useEffect(() => {
		if (tags.length > 0) {
			localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
		}
	}, [tags]);

	const addArticle = (article: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
		const id = String(Math.max(...articles.map((a) => parseInt(a.id) || 0), 0) + 1);
		const now = new Date().toISOString().split('T')[0];
		setArticles([...articles, { ...article, id, createdAt: now, updatedAt: now }]);

		// Update tags
		article.tags.forEach((tagName) => {
			const existingTag = tags.find((t) => t.name === tagName);
			if (!existingTag) {
				const tagId = `tag-${Date.now()}-${Math.random()}`;
				setTags([...tags, { id: tagId, name: tagName, count: 1 }]);
			}
		});
	};

	const updateArticle = (
		id: string,
		updates: Partial<Omit<BlogArticle, 'id' | 'createdAt'>>,
	): BlogArticle | undefined => {
		let updated: BlogArticle | undefined;
		const now = new Date().toISOString().split('T')[0];

		setArticles(
			articles.map((a) => {
				if (a.id === id) {
					updated = { ...a, ...updates, updatedAt: now };
					return updated;
				}
				return a;
			}),
		);

		return updated;
	};

	const deleteArticle = (id: string): boolean => {
		const exists = articles.some((a) => a.id === id);
		if (exists) {
			setArticles(articles.filter((a) => a.id !== id));
		}
		return exists;
	};

	const getArticleBySlug = (slug: string): BlogArticle | undefined => {
		return articles.find((a) => a.slug === slug);
	};

	const getArticleById = (id: string): BlogArticle | undefined => {
		return articles.find((a) => a.id === id);
	};

	const incrementViewCount = (id: string) => {
		setArticles(articles.map((a) => (a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a)));
	};

	const getPublishedArticles = (): BlogArticle[] => {
		return articles.filter((a) => a.status === 'Đã đăng');
	};

	const searchArticles = (keyword: string): BlogArticle[] => {
		const lower = keyword.toLowerCase();
		return articles.filter(
			(a) =>
				a.title.toLowerCase().includes(lower) ||
				a.summary.toLowerCase().includes(lower) ||
				a.content.toLowerCase().includes(lower),
		);
	};

	const filterByTag = (tag: string): BlogArticle[] => {
		return articles.filter((a) => a.tags.includes(tag) && a.status === 'Đã đăng');
	};

	const getRelatedArticles = (articleId: string, limit: number = 3): BlogArticle[] => {
		const article = getArticleById(articleId);
		if (!article) return [];

		return articles
			.filter((a) => a.id !== articleId && a.status === 'Đã đăng' && a.tags.some((tag) => article.tags.includes(tag)))
			.slice(0, limit);
	};

	const getAllTags = (): BlogTag[] => {
		return tags.map((tag) => ({
			...tag,
			count: articles.filter((a) => a.tags.includes(tag.name) && a.status === 'Đã đăng').length,
		}));
	};

	const getTagCount = (tagName: string): number => {
		return articles.filter((a) => a.tags.includes(tagName) && a.status === 'Đã đăng').length;
	};

	const addTag = (tagName: string) => {
		if (!tags.find((t) => t.name === tagName)) {
			const tagId = `tag-${Date.now()}-${Math.random()}`;
			setTags([...tags, { id: tagId, name: tagName }]);
		}
	};

	const deleteTag = (tagName: string) => {
		setTags(tags.filter((t) => t.name !== tagName));
		setArticles(
			articles.map((a) => ({
				...a,
				tags: a.tags.filter((t) => t !== tagName),
			})),
		);
	};

	const isSlugExists = (slug: string): boolean => {
		return articles.some((a) => a.slug === slug);
	};

	return {
		articles,
		tags,
		addArticle,
		updateArticle,
		deleteArticle,
		getArticleBySlug,
		getArticleById,
		incrementViewCount,
		getPublishedArticles,
		searchArticles,
		filterByTag,
		getRelatedArticles,
		getAllTags,
		getTagCount,
		addTag,
		deleteTag,
		isSlugExists,
	};
};
