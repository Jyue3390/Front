<template>
  <div class="album-detail">
    <!-- 相册文字详情 -->
    <div class="album-info">
      <h1>{{ album.name }} 相册</h1>
      <p><strong>描述:</strong> {{ album.description }}</p>
      <p><strong>隐私设置:</strong> {{ album.isPrivate ? '隐私相册' : '公开相册' }}</p>
      <p><strong>创建日期:</strong> {{ album.createdAt }}</p>
    </div>

    <!-- 上传照片按钮 -->
    <button class="upload-btn" @click="triggerUpload">上传照片</button>

    <!-- 显示相册中的照片 -->
    <div class="image-grid">
      <div class="photo" v-for="photo in photos" :key="photo.id">
        <img :src="photo.url" :alt="photo.name" class="photo-img" />
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input ref="fileInput" type="file" style="display: none" @change="handleFileUpload">
  </div>
</template>

<script>
import { fetchAlbumDetails, uploadPhoto } from '@/api/album' // 引入 API 调用方法

export default {
  name: 'AlbumDetail',
  data() {
    return {
      album: {
        name: '',
        description: '',
        isPrivate: false,
        createdAt: ''
      },
      photos: [] // 照片列表
    }
  },
  created() {
    const albumId = this.$route.query.albumId // 获取路由中的 albumId
    this.fetchAlbumDetails(albumId) // 调用方法从后端获取相册详情
  },
  methods: {
    // 从后端获取相册详情
    async fetchAlbumDetails(albumId) {
      try {
        const response = await fetchAlbumDetails(albumId)
        if (response.code === 20000) {
          this.album = response.data.album // 获取相册信息
          this.photos = response.data.photos // 获取照片列表
        } else {
          this.$message.error('无法加载相册详情')
        }
      } catch (error) {
        console.error('获取相册详情时出错:', error)
        this.$message.error('加载相册详情失败')
      }
    },
    // 触发文件输入框
    triggerUpload() {
      this.$refs.fileInput.click() // 点击文件输入框
    },

    // 处理文件上传
    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        try {
          // 调用后端上传接口
          const response = await uploadPhoto(this.$route.query.albumId, file)
          if (response.code === 20000) {
            this.$message.success('照片上传成功')
            // this.fetchAlbumPhotos(this.$route.query.albumId) // 重新加载照片列表
          } else {
            this.$message.error('照片上传失败')
          }
        } catch (error) {
          console.error('上传照片时出错:', error)
          this.$message.error('照片上传失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.album-detail {
  padding: 30px;
  background-color: #f8f8f8;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.album-info {
  text-align: left;
  margin-bottom: 20px;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #555;
}

strong {
  font-weight: bold;
}

.upload-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.upload-btn:hover {
  background-color: #45a049;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 10px;
  overflow: hidden; /* 禁用滚动条 */
}

.photo {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.photo-img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}
</style>
