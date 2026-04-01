// Example routes configuration to add to config/routes.ts
// Add this to your routes array:

{
  path: '/caulacbo',
  name: 'Câu lạc bộ',
  icon: 'TeamOutlined',
  component: './CauLacBo',
  // Optional: Add sub-routes if needed
  routes: [
    {
      path: '/caulacbo',
      redirect: '/caulacbo/list',
    },
    {
      path: '/caulacbo/list',
      name: 'Danh sách',
      component: './CauLacBo',
    },
  ],
}

// For sidebar icon, import TeamOutlined:
// import { TeamOutlined } from '@ant-design/icons';
