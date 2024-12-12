import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/dashboard',
    name: 'Admin',
    meta: { roles: ['admin'], title: 'Admin', icon: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/editor',
    component: Layout,
    redirect: '/editor/dashboard',
    name: 'Editor',
    meta: { roles: ['editor'], title: 'Editor', icon: 'editor' },
    children: [
      {
        path: 'dashboard',
        name: 'EditorDashboard',
        component: () => import('@/views/editor/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      },

      {
        path: '/form',
        component: Layout,
        children: [
          {
            path: 'index',
            name: 'Form',
            component: () => import('@/views/editor/form/index'),
            meta: { title: 'Form', icon: 'form' }
          }
        ]
      },

      {
        path: 'external-link',
        component: Layout,
        children: [
          {
            path: 'https://github.com/Jyue3390/Front',
            meta: { title: 'External Link', icon: 'link' }
          }
        ]
      },

      {
        path: 'album',
        component: Layout,
        children: [
          {
            path: ':albumId',
            name: 'AlbumDetail',
            component: () => import('@/views/editor/album/AlbumDetail.vue'),
            meta: { title: 'Album Detail', icon: 'album' }
          }
        ],
        hidden: true // 隐藏在侧边栏中
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

import store from '@/store' // 确保路径正确，@ 通常是别名指向 src
router.beforeEach((to, from, next) => {
  const roles = store.getters.roles // 使用Vuex中存储的角色信息
  const roleAuth = to.meta.roles
  if (roleAuth && roleAuth.length > 0) {
    if (roleAuth.some(role => roles.includes(role))) {
      next()
    } else {
      next('/404') // 没有权限，重定向到404页面
    }
  } else {
    next() // 公共路由，不需要角色验证
  }
})
export default router
