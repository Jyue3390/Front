<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  height: calc(100vh - 50px); /* 全屏高度减去导航栏高度 */
  overflow: hidden; /* 禁止主内容滚动 */
  display: flex; /* 使用 Flex 布局，方便容器分配空间 */
  flex-direction: column;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
