import Layout from '@/layout/index.js'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true // 不显示在侧边栏中
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout, // 保留 Layout 用于动态路由嵌套
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', roles: ['editor', 'admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
