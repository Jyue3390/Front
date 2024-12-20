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
      <div v-for="photo in photos" :key="photo.id" class="photo" @click="openImageModal(photo)">
        <img :src="photo.url" :alt="photo.name" class="photo-img">
        <!-- 显示照片审核状态 -->
        <p :class="getAuditStatusClass(photo.auditStatus)">
          {{ getAuditStatusText(photo.auditStatus) }}
        </p>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input ref="fileInput" type="file" style="display: none" @change="handleFileUpload">

    <!-- 放大查看照片的模态框 -->
    <div v-if="isModalVisible" class="image-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button> <!-- Close button -->
        <img :src="currentImage.url" :alt="currentImage.name" class="modal-image">
        <button class="prev-btn" @click="showPrevImage">❮</button>
        <button class="next-btn" @click="showNextImage">❯</button>
      </div>
    </div>
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
      photos: [], // 照片列表
      isModalVisible: false, // 控制模态框显示与否
      currentImage: {} // 当前放大的图片
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
    },

    // 打开图片模态框
    openImageModal(photo) {
      this.currentImage = photo
      this.isModalVisible = true
    },

    // 关闭图片模态框
    closeModal() {
      this.isModalVisible = false
    },

    // 显示上一张图片
    showPrevImage() {
      const currentIndex = this.photos.indexOf(this.currentImage)
      if (currentIndex > 0) {
        this.currentImage = this.photos[currentIndex - 1]
      } else {
        this.currentImage = this.photos[this.photos.length - 1] // 循环到最后一张
      }
    },

    // 显示下一张图片
    showNextImage() {
      const currentIndex = this.photos.indexOf(this.currentImage)
      if (currentIndex < this.photos.length - 1) {
        this.currentImage = this.photos[currentIndex + 1]
      } else {
        this.currentImage = this.photos[0] // 循环到第一张
      }
    },
    // 获取审核状态的文本
    getAuditStatusText(status) {
      if (status === 0) return '审核中'
      if (status === 1) return '审核通过'
      return '审核不通过'
    },

    // 获取审核状态对应的类名
    getAuditStatusClass(status) {
      if (status === 0) return 'pending' // Pending
      if (status === 1) return 'approved' // Approved
      return 'rejected' // Rejected
    }
  }
}
</script>

<style scoped>
.album-detail {
  padding: 30px;
  left: 54px; /* 距离左边20px */
  width: calc(100% - 54px); /* 总宽度减去左20px的空白 */
  background-color: #f8f8f8;
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

.photo p {
  font-size: 14px;
  color: #777;
  margin-top: 8px;
}

/* 为不同审核状态添加颜色 */
.photo p.pending {
  color: #ff9900; /* Pending */
}

.photo p.approved {
  color: green; /* Approved */
}

.photo p.rejected {
  color: red; /* Rejected */
}

.photo-img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* 模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 54px; /* 距离左边20px */
  width: calc(100% - 54px); /* 总宽度减去左20px的空白 */
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.prev-btn, .next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

/* Close button style */
.close-btn {
  position: absolute;
  top: 20px;
  right: 40px;
  background: transparent;
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  z-index: 20;
}

.close-btn:hover {
  color: #ff4d4d; /* Hover color for the close button */
}
</style>
