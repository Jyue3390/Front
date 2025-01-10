<template>
  <div class="mine-container">
    <!-- Profile Section -->
    <div class="profile">
      <!-- 创建相册按钮 -->
      <button
        class="create-album-btn"
        :disabled="isMuted"
        @click="createAlbum"
      >
        {{ isMuted ? '您已被禁言，无法上传图片' : '新建相册' }}
      </button>
      <p v-if="isMuted" class="muted-message">您已被禁言</p> <!-- Show muted message if user is muted -->

      <!-- 显示相册 -->
      <div class="album-grid">
        <div
          v-for="(album, index) in albums"
          :key="index"
          class="album-item"
          @click="goToAlbumDetail(album.id)"
        >
          <div class="album-content">
            <h3>{{ album.name }}</h3>
            <span v-if="album.isPrivate" class="private-tag">隐私相册</span>
            <span v-else class="public-tag">公开相册</span>
          </div>
        </div>
      </div>

      <!-- 新建相册表单 -->
      <div v-if="showNewAlbumForm" class="modal-overlay">
        <div class="modal-content">
          <h2>创建新相册</h2>
          <input v-model="newAlbum.name" type="text" placeholder="相册名称">
          <input v-model="newAlbum.description" type="text" placeholder="相册描述">
          <!-- 隐私相册选项 -->
          <div class="privacy-option">
            <label>
              <input v-model="newAlbum.isPrivate" type="checkbox">
              设为隐私相册
            </label>
          </div>
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
import { createAlbum, fetchAlbumList } from '@/api/album'

export default {
  name: 'Mine',
  data() {
    return {
      albums: [], // 存储相册数据
      showNewAlbumForm: false, // 控制新建相册表单显示
      newAlbum: { name: '', description: '', isPrivate: false } // 新建相册的数据
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
      'violation',
      'role' // 从 Vuex 获取用户名称
    ]),
    // 计算属性检查用户是否被禁言
    isMuted() {
      return this.violation !== 0
    }
  },
  created() {
    // 获取用户相册列表
    this.loadUserAlbums()
  },
  methods: {
    // 加载用户相册列表
    loadUserAlbums() {
      fetchAlbumList(this.id) // 获取用户ID
        .then(response => {
          if (response.code === 20000) {
            this.albums = response.data // 将返回的相册数据存储到 albums 数组
          } else {
            alert('无法加载相册列表')
          }
        })
        .catch(error => {
          console.error('Error loading albums:', error)
          alert('无法加载相册列表，请稍后再试')
        })
    },
    // 创建相册按钮
    createAlbum() {
      if (this.isMuted) {
        this.$message.warning('您已被禁言')
        return
      }
      this.showNewAlbumForm = true
    },
    // 保存新建的相册
    saveAlbum() {
      if (this.newAlbum.name && this.newAlbum.description) {
        const albumData = {
          name: this.newAlbum.name,
          description: this.newAlbum.description,
          isPrivate: this.newAlbum.isPrivate,
          ownerId: this.id // Use Vuex user ID here
        }

        createAlbum(albumData) // 调用后端 API 创建相册
          .then(response => {
            if (response.code === 20000) {
              this.$message.success('相册创建成功') // 成功提示
              this.albums.push(response.data) // 将新相册添加到 albums 数组
              this.showNewAlbumForm = false // 关闭表单
              this.newAlbum = { name: '', description: '', isPrivate: false } // 重置表单
            } else {
              this.$message.error('创建相册失败，请稍后再试')
            }
          })
          .catch(error => {
            console.error('Error creating album:', error)
            this.$message.error('创建相册失败，请稍后再试')
          })
      } else {
        this.$message.warning('请填写相册名称和描述')
      }
    },
    // 取消新建相册表单
    cancelAlbum() {
      this.showNewAlbumForm = false
    },
    // 跳转到相册详情页
    goToAlbumDetail(albumId) {
      this.$router.push({ name: 'AlbumDetail', query: { albumId: albumId }})
    }
  }
}
</script>

<style scoped>
.muted-message {
  color: red;
  font-size: 14px;
}

.mine-container {
  padding: 20px;
  background-color: #f0f0f0;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.private-tag {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}

.public-tag {
  color: green;
  font-size: 0.9rem;
  text-align: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.album-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.album-content {
  font-size: 1.1rem;
  color: #333;
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
