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
		name: 'OanTuTi',
		icon: 'PlayCircleOutlined',
		component: './oantuti',
	},
{
				path: '/ngan-hang-cau-hoi',
				name: 'NganHangCauHoi',
				icon: 'DatabaseOutlined',
				component: './Exam',
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