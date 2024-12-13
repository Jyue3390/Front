<template>
  <div id="app">
    <header>
      <h1>欢迎来到首页</h1>
    </header>
    <main>
      <p>这是一个简单的 Vue 3 首页示例。</p>
      <button @click="goToAbout">关于我们</button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goToAbout() {
      // 假设这里是跳转到另一个页面的逻辑
      console.log('跳转到关于我们页面')
    }
  }
}
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 50px;
}

header {
  background-color: #42b983;
  padding: 20px;
  color: white;
}

main {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #358a6b;
}
</style>
