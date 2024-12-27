<template>
  <div :class="{'has-logo': showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in filteredRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'role']), // 获取用户角色
    // 过滤出根据角色显示的路由
    filteredRoutes() {
      const allRoutes = this.$router.options.routes
      if (this.role === 'doctor') {
        // admin 看到所有路由
        return allRoutes.filter(route =>
          route.path === '/' || route.path === '/comment' || route.path === '/image' || route.path === 'external-link'
        )
      } else if (this.role === 'patient') {
        // editor 只看到 dashboard 和 form
        return allRoutes.filter(route =>
          route.path === '/' || route.path === '/mine' || route.path === '/form' || route.path === 'external-link'
        )
      }
      return []
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      return meta.activeMenu || path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
