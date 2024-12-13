// routes.js
import Layout from '@/layout'
import Dashboard from '@/views/dashboard'
import Form from '@/views/form'
import Comment from '@/views/manage/comment'
import Image from '@/views/manage/image'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 其他不需要角色权限控制的静态路由
]

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    meta: { roles: ['admin', 'editor'] }, // admin 和 editor 都可以访问
    children: [
      {
        path: '',
        component: Dashboard,
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    meta: { roles: ['editor'] }, // 只有 editor 可以访问
    children: [
      {
        path: '',
        component: Form,
        name: 'Form',
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/manage/comment',
    component: Layout,
    meta: { roles: ['admin'] }, // 只有 admin 可以访问
    children: [
      {
        path: '',
        component: Comment,
        name: 'Comment',
        meta: { title: 'Comment', icon: 'comment' }
      }
    ]
  },
  {
    path: '/manage/image',
    component: Layout,
    meta: { roles: ['admin'] }, // 只有 admin 可以访问
    children: [
      {
        path: '',
        component: Image,
        name: 'Image',
        meta: { title: 'Image', icon: 'image' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]
