<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header': fixedHeader}" class="navbar-wrapper">
        <navbar />
      </div>
      <app-main class="scrollable-main" />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  display: flex;
  flex-direction: row; /* 左侧固定侧边栏，右侧为主内容 */
  height: 100vh; /* 高度占满视口 */
  overflow: hidden; /* 禁止整个布局滚动 */
}

.sidebar-container {
  position: fixed; /* 固定侧边栏 */
  top: 0;
  left: 0;
  width: #{$sideBarWidth}; /* 自定义侧边栏宽度 */
  height: 100vh;
  z-index: 10;
  background-color: #f4f4f4;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column; /* 导航栏和主内容上下布局 */
  margin-left: #{$sideBarWidth}; /* 避免主内容覆盖侧边栏 */
  flex: 1; /* 占满剩余空间 */
  height: 100vh; /* 高度占满视口 */
  overflow: hidden; /* 禁止整体滚动 */
}

.navbar-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth}); /* 考虑侧边栏宽度 */
  height: 50px; /* 导航栏高度 */
  background: #fff; /* 可根据需要调整背景色 */
  border-bottom: 1px solid #ddd; /* 可选：添加分隔线 */
}

.scrollable-main {
  flex: 1; /* 占满主内容区域 */
  margin-top: 50px; /* 避免被导航栏覆盖 */
  padding: 20px; /* 内容内边距 */
  overflow-y: auto; /* 启用垂直滚动 */
  position: relative;
  background-color: #f0f0f0; /* 可根据需要调整背景色 */
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.hideSidebar .navbar-wrapper {
  width: calc(100% - 54px);
}

.mobile .navbar-wrapper {
  width: 100%;
}
</style>
