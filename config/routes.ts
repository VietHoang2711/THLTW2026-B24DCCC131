export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
		],
	},

	///////////////////////////////////

	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/doan-so',
		name: 'DoanSo',
		icon: 'QuestionOutlined',
		component: './DoanSo',
	},
	{
		path: '/hoc-tap',
		name: 'HocTap',
		icon: 'BookOutlined',
		component: './HocTap',
	},

	{
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		icon: 'PlayCircleOutlined',
		component: './oantuti',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'Ngân Hàng Câu Hỏi',
		icon: 'DatabaseOutlined',
		component: './Exam',
	},
	{
		path: '/dich-vu',
		name: 'Dịch Vụ',
		icon: 'SettingOutlined',
		component: './DichVu',
	},
	{
		path: '/bang-cap',
		name: 'Quản Lý Văn Bằng',
		icon: 'FileTextOutlined',
		component: './BangCap',
	},
	{
		path: '/cau-lac-bo',
		name: 'Câu Lạc Bộ',
		icon: 'TeamOutlined',
		component: './CauLacBo',
	},
	{
		path: '/travel',
		name: 'Du Lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/travel/discover',
				name: 'Khám Phá',
				component: './Travel/Discover',
			},
			{
				path: '/travel/planner',
				name: 'Lập Kế Hoạch',
				component: './Travel/Planner',
			},
			{
				path: '/travel/budget',
				name: 'Ngân Sách',
				component: './Travel/Budget',
			},
			{
				path: '/travel/admin',
				name: 'Travel Admin',
				component: './Travel/Admin',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: '/notification/subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: '/notification/check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: '/notification',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
