<template>
  <div id="app">
    <main>
      <div class="user-info">
        <div class="avatar">
          <img :src="avatar" alt="用户头像">
          <input type="file" @change="uploadAvatar">
        </div>
        <div class="info">
          <label>用户名:</label>
          <input v-model="localName" :disabled="!isEditing" type="text">

          <label>邮箱:</label>
          <input v-model="localEmail" :disabled="!isEditing" type="email">

          <label>电话:</label>
          <input v-model="localPhone" :disabled="!isEditing" type="tel">

          <button v-if="!isEditing" @click="editInfo">修改信息</button>
          <button v-if="isEditing" @click="saveChanges">保存更改</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadPhoto, updateUserInfo, getUserInfoById } from '@/api/user'

export default {
  name: 'UserProfile',
  computed: {
    ...mapGetters(['id', 'avatar', 'name', 'email', 'phone']) // Vuex 状态
  },
  data() {
    return {
      isEditing: false, // 编辑模式标志
      localName: '', // 本地存储用于编辑的用户名
      localEmail: '', // 本地存储用于编辑的邮箱
      localPhone: '' // 本地存储用于编辑的电话
    }
  },
  async mounted() {
    await this.refreshUserInfo() // 初始化加载用户信息
    this.initializeLocalData() // 同步本地数据
  },
  methods: {
    async uploadAvatar(event) {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('userId', this.id)
        formData.append('file', file)

        try {
          const response = await uploadPhoto(this.id, file)
          if (response.code === 20000) {
            alert('头像上传成功')
            await this.refreshUserInfo() // 刷新用户信息
          } else {
            alert('头像上传失败，请重试')
          }
        } catch (error) {
          console.error('上传头像时出错:', error)
          alert('上传失败，请稍后再试')
        }
      }
    },
    editInfo() {
      this.isEditing = true

      // 初始化本地数据
      this.localName = this.name
      this.localEmail = this.email
      this.localPhone = this.phone

      // 调试输出当前用户信息
      console.log('修改前的用户信息:', {
        name: this.name,
        email: this.email,
        phone: this.phone
      })
    },
    async saveChanges() {
      // 调试输出修改后的信息
      console.log('修改后的用户信息:', {
        name: this.localName,
        email: this.localEmail,
        phone: this.localPhone
      })

      try {
        const response = await updateUserInfo({
          userId: this.id,
          name: this.localName,
          email: this.localEmail,
          phone: this.localPhone
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
      this.localName = this.name
      this.localEmail = this.email
      this.localPhone = this.phone

      console.log('初始化本地数据:', {
        localName: this.localName,
        localEmail: this.localEmail,
        localPhone: this.localPhone
      })
    },

    async refreshUserInfo() {
      try {
        const userInfoResponse = await getUserInfoById(this.id)
        if (userInfoResponse.code === 20000) {
          const data = userInfoResponse.data
          this.$store.commit('user/SET_AVATAR', data.avatar)
          this.$store.commit('user/SET_NAME', data.username)
          this.$store.commit('user/SET_EMAIL', data.email)
          this.$store.commit('user/SET_PHONE', data.phone)

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
