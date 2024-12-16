<template>
  <div class="mine-container">
    <!-- mine Section -->
    <div class="mine-text">name: {{ name }}  role:{{ role }}</div>

    <!-- Profile Section -->
    <div class="profile">
      <!-- 创建相册按钮 -->
      <button class="create-album-btn" @click="createAlbum">新建相册</button>

      <!-- 显示相册 -->
      <div class="album-grid">
        <div
          v-for="(album, index) in albums"
          :key="index"
          class="album-item"
          @click="goToAlbumDetail(album.id)"
        >
          <div class="album-cover">
            <img :src="album.coverImage || (album.images.length > 0 ? album.images[0] : '/img/placeholder.jpg')" alt="Album Cover">
          </div>
          <h3>{{ album.name }}</h3>
        </div>
      </div>

      <!-- 新建相册表单 -->
      <div v-if="showNewAlbumForm" class="modal-overlay">
        <div class="modal-content">
          <h2>创建新相册</h2>
          <input v-model="newAlbum.name" type="text" placeholder="相册名称">
          <textarea v-model="newAlbum.description" placeholder="相册描述" />
          <label>
            <input v-model="newAlbum.isPrivate" type="checkbox"> 私密相册
          </label>
          <div class="button-container">
            <button class="save-btn" @click="saveAlbum">保存</button>
            <button class="cancel-btn" @click="cancelAlbum">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createAlbum, getUserAlbums } from '@/api/album'
import user from '@/store/modules/user' // 导入后端 API

export default {
  name: 'Mine',
  data() {
    return {
      albums: [], // 存储相册数据
      showNewAlbumForm: false, // 控制新建相册表单显示
      newAlbum: { name: '', description: '', isPrivate: false, ownerId: user.id } // 新建相册的数据
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
      'role' // 从 Vuex 获取用户名称
    ])
  },
  created() {
    // 获取用户相册列表
    this.loadUserAlbums()
  },
  methods: {
    // 创建相册按钮
    createAlbum() {
      this.showNewAlbumForm = true
    },
    // 保存新建的相册
    saveAlbum() {
      if (this.newAlbum.name) {
        const albumData = {
          name: this.newAlbum.name,
          description: this.newAlbum.description,
          isPrivate: this.newAlbum.isPrivate,
          ownerId: this.newAlbum.ownerId
        }

        createAlbum(albumData)
          .then(response => {
            if (response.code === 20000) {
              this.$message.success(response.message)
              this.newAlbum = { name: '', description: '', isPrivate: false } // 重置表单
              this.showNewAlbumForm = false // 关闭表单
              this.loadUserAlbums() // 刷新相册列表
            } else {
              alert('创建相册失败')
            }
          })
          .catch(error => {
            console.error('Error creating album:', error)
            alert('创建相册失败，请稍后再试')
          })
      } else {
        alert('请填写相册名称')
      }
    },
    // 取消新建相册表单
    cancelAlbum() {
      this.showNewAlbumForm = false
    },
    // 获取用户的相册列表
    loadUserAlbums() {
      // const ownerId = 1 // 假设是当前用户的ID，可以从 Vuex 或用户认证中获取
      getUserAlbums(user.id)
        .then(response => {
          if (response.code === 200) {
            this.albums = response.data // 获取并显示用户相册列表
          } else {
            alert('无法加载相册列表')
          }
        })
        .catch(error => {
          console.error('Error loading albums:', error)
          alert('无法加载相册列表，请稍后再试')
        })
    },
    // 跳转到相册详情页
    goToAlbumDetail(albumId) {
      this.$router.push(`/album/${albumId}`)
    }
  }
}
</script>

<style scoped>
.mine-container {
  padding: 20px;
  background-color: #f0f0f0;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mine-text {
  font-size: 30px;
  line-height: 46px;
}

.profile {
  padding: 20px;
  background-color: #f0f0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.create-album-btn {
  display: block;
  width: 100%;
  max-width: 250px;
  margin: 20px auto;
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-album-btn:hover {
  background-color: #2980b9;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
  flex-grow: 1;
}

.album-item {
  position: relative;
  cursor: pointer;
}

.album-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h3 {
  text-align: center;
  color: #0E0101FF;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4CAF50;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #e53935;
}
</style>
