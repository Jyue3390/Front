<template>
  <div class="album-detail">
    <h1>{{ album.name }} 相册</h1>
    <p><strong>描述:</strong> {{ album.description }}</p>
    <p><strong>隐私设置:</strong> {{ album.isPrivate ? '隐私相册' : '公开相册' }}</p>
    <p><strong>创建日期:</strong> {{ album.createdAt }}</p>
    <!-- 上传照片按钮 -->
    <button class="upload-btn" @click="triggerUpload">上传照片</button>

    <!-- 隐藏的文件输入框 -->
    <input ref="fileInput" type="file" style="display: none" @change="handleFileUpload" />
  </div>
</template>

<script>
import { fetchAlbumDetails, uploadPhoto } from '@/api/album' // 引入 API 调用方法

export default {
  name: 'AlbumDetail',
  data() {
    return {
      album: { name: '', description: '', isPrivate: false, createdAt: ''
      } // 相册数据
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
          this.album = response.data // 更新 album 数据
        } else {
          this.$message.error('无法加载相册详情')
        }
      } catch (error) {
        console.error('Error fetching album details:', error)
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
          // 使用 FormData 封装文件和 albumId
          // const formData = new FormData()
          // formData.append('file', file)
          // formData.append('albumId', this.$route.query.albumId) // 添加相册 ID 到请求中

          // 调用后端上传接口
          const response = await uploadPhoto(this.$route.query.albumId, file)
          if (response.code === 20000) {
            this.$message.success('照片上传成功')
            // 可选: 更新相册的照片列表或其他相应操作
          } else {
            this.$message.error('照片上传失败')
          }
        } catch (error) {
          console.error('Error uploading photo:', error)
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

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
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
}

.upload-btn:hover {
  background-color: #45a049;
}
</style>
