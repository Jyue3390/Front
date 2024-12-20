<template>
  <div id="app">
    <main>
      <div class="user-info">
        <div class="avatar">
          <!-- 实时绑定 Vuex 中的 avatar 状态 -->
          <img :src="avatar" alt="用户头像">
          <input type="file" @change="uploadAvatar">
        </div>
        <div class="info">
          <label>用户名:</label>
          <input v-model="name" :disabled="!isEditing" type="text">

          <label>邮箱:</label>
          <input v-model="email" :disabled="!isEditing" type="email">

          <label>电话:</label>
          <input v-model="phone" :disabled="!isEditing" type="tel">

          <button v-if="!isEditing" @click="editInfo">修改信息</button>
          <button v-if="isEditing" @click="saveChanges">保存更改</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { uploadPhoto, updateUserInfo, getUserInfoById } from '@/api/user'

export default {
  name: 'UserProfile',
  computed: {
    ...mapGetters([
      'name',
      'id', // 用户 ID
      'role', // 用户角色
      'avatar', // 实时从 Vuex 获取用户头像 URL
      'violation',
      'phone',
      'email'
    ])
  },
  data() {
    return {
      isEditing: false // 控制是否处于编辑模式
    }
  },
  methods: {
    ...mapActions(['setAvatar']), // Vuex action，用于更新头像

    async uploadAvatar(event) {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('userId', this.id) // 从 Vuex 获取用户 ID
        formData.append('file', file)

        try {
          const response = await uploadPhoto(this.id, file) // 调用 API 上传
          alert('上传中，请等待')
          if (response.code === 20000) {
            alert('头像上传成功')
            // 获取最新用户数据
            const userInfoResponse = await getUserInfoById(this.id)
            if (userInfoResponse.code === 20000) {
              // 更新 Vuex 状态
              this.$store.commit('user/SET_AVATAR', userInfoResponse.data.avatar)
              this.$store.commit('user/SET_NAME', userInfoResponse.data.name)
              this.$store.commit('user/SET_EMAIL', userInfoResponse.data.email)
              this.$store.commit('user/SET_PHONE', userInfoResponse.data.phone)
            }
          } else {
            alert('头像上传失败，请重试')
          }
        } catch (error) {
          console.error('上传头像时出错:', error)
          alert('上传失败，请检查网络或稍后再试')
        }
      }
    },
    editInfo() {
      this.isEditing = true
    },
    async saveChanges() {
      try {
        const response = await updateUserInfo({
          userId: this.id,
          name: this.name,
          email: this.email,
          phone: this.phone
        })

        if (response.code === 20000) {
          alert('信息已保存')
          this.isEditing = false

          // 获取最新用户数据
          const userInfoResponse = await getUserInfoById(this.id)
          if (userInfoResponse.code === 20000) {
            // 更新 Vuex 状态
            this.$store.commit('user/SET_AVATAR', userInfoResponse.data.avatar)
            this.$store.commit('user/SET_NAME', userInfoResponse.data.name)
            this.$store.commit('user/SET_EMAIL', userInfoResponse.data.email)
            this.$store.commit('user/SET_PHONE', userInfoResponse.data.phone)
          }
        } else {
          alert('保存失败，请重试')
        }
      } catch (error) {
        console.error('保存信息时出错:', error)
        alert('保存失败，请稍后再试')
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

.avatar {
  margin-right: 20px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.avatar input[type="file"] {
  display: block;
  margin-top: 10px;
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
