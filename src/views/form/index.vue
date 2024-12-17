<template>
  <div class="home">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">欢迎来到广场</h1>
    </div>

    <!-- Image Grid -->
    <div class="image-grid">
      <div
        v-for="photo in images"
        :key="photo.id"
        class="photo"
        @click="openImageModal(photo)"
      >
        <div class="image-container">
          <img :src="photo.url" :alt="photo.name" class="photo-img">
          <div class="image-overlay">
            <div class="icons">
              <a href="#" class="icon fas fa-heart" @click.prevent="toggleLike(photo)" />
              <a href="#" class="icon fas fa-comment" @click.prevent="selectImage(photo)" />
              <a href="#" class="icon fas fa-share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPublicPhotos } from '@/api/general'

export default {
  name: 'Home',
  data() {
    return {
      images: [], // 原始照片数据
      isModalVisible: false, // 控制模态框显示与否
      currentImage: {} // 当前放大的图片
    }
  },
  async created() {
    await this.fetchPhotos() // 获取照片数据
  },
  methods: {
    // 从后端获取照片
    async fetchPhotos() {
      try {
        const response = await fetchPublicPhotos()
        if (response.code === 20000) {
          this.images = response.data
        } else {
          this.$message.error('无法加载照片')
        }
      } catch (error) {
        console.error('获取照片时出错:', error)
        this.$message.error('加载照片失败')
      }
    },
    toggleLike(photo) {
      photo.liked = !photo.liked
      if (photo.liked) {
        alert('您已点赞')
      } else {
        alert('您已取消点赞')
      }
    },
    selectImage(photo) {
      this.$emit('select-image', photo)
    },
    openImageModal(photo) {
      this.currentImage = photo
      this.isModalVisible = true
    }
  }
}
</script>

<style scoped>
.home {
  padding: 30px;
  background-color: #f8f8f8;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo {
  cursor: pointer;
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.photo-img {
  max-width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}

.photo:hover .photo-img {
  transform: scale(1.05); /* 图片放大效果 */
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  transform: translateY(100%); /* 初始时遮罩位于图片下方 */
  transition: transform 0.3s ease;
  padding: 10px;
  box-sizing: border-box;
}

.photo:hover .image-overlay {
  transform: translateY(0); /* 鼠标悬停时遮罩从下方滑出 */
}

.icons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.icon {
  color: white;
  font-size: 20px;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.icon:hover {
  color: #3498db; /* 鼠标悬停时图标颜色变化 */
}

.image-modal {
  position: fixed;
  top: 0;
  left: 54px;
  width: calc(100% - 54px);
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
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
  color: #ff4d4d;
}
</style>
