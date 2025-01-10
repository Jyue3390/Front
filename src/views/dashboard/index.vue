<template>
  <div id="app">
    <main>
      <div class="user-info">
        <div class="info">
          <label>用户名:</label>
          <input v-model="localUsername" :disabled="!isEditing" type="text">

          <label>姓名:</label>
          <input v-model="localName" :disabled="!isEditing" type="text">

          <label>角色:</label>
          <input v-model="localRole" :disabled="!isEditing" type="text">

          <label>角色ID:</label>
          <input v-model="localRoleid" :disabled="!isEditing" type="text">

          <button v-if="!isEditing" @click="editInfo">修改信息</button>
          <button v-if="isEditing" @click="saveChanges">保存更改</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserInfo, getInfo } from '@/api/user'

export default {
  name: 'UserProfile',
  computed: {
    ...mapGetters(['roleid', 'username', 'name', 'role', 'id', 'token']) // Vuex 状态
  },
  data() {
    return {
      isEditing: false, // 编辑模式标志
      localUsername: '', // 本地存储用于编辑的用户名
      localName: '', // 本地存储用于编辑的姓名
      localRole: '', // 本地存储用于编辑的角色
      localRoleid: '', // 本地存储用于编辑的角色ID
      localId: ''
    }
  },
  async mounted() {
    await this.refreshUserInfo() // 初始化加载用户信息
    this.initializeLocalData() // 同步本地数据
  },
  methods: {
    editInfo() {
      this.isEditing = true

      // 初始化本地数据
      this.localUsername = this.username
      this.localName = this.name
      this.localRole = this.role
      this.localRoleid = this.roleid
      this.localId = this.id
      // 调试输出当前用户信息
      console.log('修改前的用户信息:', {
        username: this.username,
        name: this.name,
        role: this.role,
        roleid: this.roleid,
        id: this.id
      })
    },
    async saveChanges() {
      // 调试输出修改后的信息
      console.log('修改后的用户信息:', {
        username: this.localUsername,
        name: this.localName,
        role: this.localRole,
        roleid: this.localRoleid,
        id: this.id
      })

      try {
        const response = await updateUserInfo({
          id: this.id,
          username: this.localUsername,
          name: this.localName,
          role: this.localRole,
          roleid: this.localRoleid
        })

        if (response.code === 20000) {
          alert('信息已保存')
          this.isEditing = false
          await this.refreshUserInfo() // 刷新用户信息
        } else {
          alert('保存失败，请重试')
        }
      } catch (error) {
        console.error('保存信息时出错:', error)
        alert('保存失败，请稍后再试')
      }
    },
    initializeLocalData() {
      this.localUsername = this.username
      this.localName = this.name
      this.localRole = this.role
      this.localRoleid = this.roleid
      this.localId = this.id

      console.log('初始化本地数据:', {
        localUsername: this.localUsername,
        localName: this.localName,
        localRole: this.localRole,
        localRoleid: this.localRoleid,
        localId: this.localId
      })
    },

    async refreshUserInfo() {
      try {
        const userInfoResponse = await getInfo(this.token)
        if (userInfoResponse.code === 20000) {
          const data = userInfoResponse.data
          this.$store.commit('user/SET_ID', data.id)
          this.$store.commit('user/SET_USERNAME', data.username)
          this.$store.commit('user/SET_NAME', data.name)
          this.$store.commit('user/SET_ROLE', data.role)
          this.$store.commit('user/SET_ROLEID', data.roleid)

          // 刷新后再次同步本地数据
          this.initializeLocalData()
        } else {
          console.error('获取用户信息失败:', userInfoResponse.message)
        }
      } catch (error) {
        console.error('刷新用户信息时出错:', error)
      }
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

.user-info {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.info {
  text-align: left;
}

.info label {
  display: block;
  margin-top: 10px;
}

.info input {
  width: 200px;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
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
