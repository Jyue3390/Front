<template>
  <div class="album-detail">
    <h1>{{ album.name }} 相册</h1>
    <p><strong>描述:</strong> {{ album.description }}</p>
    <p><strong>隐私设置:</strong> {{ album.isPrivate ? '隐私相册' : '公开相册' }}</p>
    <p><strong>创建日期:</strong> {{ album.createdAt }}</p>
  </div>
</template>

<script>
import { fetchAlbumDetails } from '@/api/album' // 引入 API 调用方法

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
</style>
