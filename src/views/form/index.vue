<template>
  <div class="home">
    <div class="header">
      <!-- Title centered -->
      <h1 class="page-title">欢迎来到广场</h1>
    </div>

    <!-- Image Grid -->
    <div class="image-grid">
<!--      <div-->
<!--        v-for="(image, index) in images"-->
<!--        v-if="images.length > 0"-->
<!--        :key="index"-->
<!--        class="image-item"-->
<!--        @click="openImageModal(image)"-->
<!--      >-->
<!--        <div class="photo">-->
<!--          <img :src="image.url" :alt="image.name" class="photo-img">-->
<!--        </div>-->
<!--      </div>-->
      <div class="photo" v-for="photo in images" :key="photo.id" @click="openImageModal(photo)">
        <img :src="photo.url" :alt="photo.name" class="photo-img" />
      </div>
<!--      <div v-else class="no-content">-->
<!--        <p>无相关内容</p>-->
<!--      </div>-->
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
    await this.fetchPhotos() // 在组件创建时获取照片数据
  },
  methods: {
    // 从后端获取照片
    async fetchPhotos() {
      try {
        const response = await fetchPublicPhotos() // 调用 API 方法获取公开照片
        if (response.code === 20000) {
          this.images = response.data// .photos
        } else {
          this.$message.error('无法加载照片')
        }
      } catch (error) {
        console.error('获取照片时出错:', error)
        this.$message.error('加载照片失败')
      }
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
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 10px;
}

.image-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.photo-img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.no-content {
  color: #888;
  font-size: 16px;
}

</style>
