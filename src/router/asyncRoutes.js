import Layout from '@/layout/index.js' // 确保正确引入

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout, // 使用 Layout 作为父级
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { roles: ['editor'], title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout, // 使用 Layout 作为父级
    children: [
      {
        path: '',
        component: () => import('@/views/form/index.vue'),
        meta: { roles: ['editor'], title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout, // 使用 Layout 作为父级
    redirect: '/manage/comment',
    meta: { roles: ['admin'], title: 'Manage', icon: 'manage' },
    children: [
      {
        path: 'comment',
        component: () => import('@/views/manage/comment/index.vue'),
        meta: { roles: ['admin'], title: 'Comment Management', icon: 'comment' }
      },
      {
        path: 'image',
        component: () => import('@/views/manage/image/index.vue'),
        meta: { roles: ['admin'], title: 'Image Management', icon: 'image' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout, // 使用 Layout 作为父级
    children: [
      {
        path: 'https://example.com',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]
