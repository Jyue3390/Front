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
      >
        <div class="image-container">
          <img :src="photo.url" :alt="photo.name" class="photo-img">
        </div>
        <div class="action-buttons">
          <button
            class="like-button"
            :class="{'liked': photo.liked}"
            @click="handleLike(photo.id)"
          >
            <span v-if="photo.liked" class="heart filled">❤️</span>
            <span v-else class="heart">🤍</span>
          </button>
          <span class="like-count">{{ photo.likeCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPublicPhotos, likePhoto } from '@/api/general'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      images: [] // 照片数据
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
      'role' // 从 Vuex 获取用户名称
    ])
  },
  async created() {
    // 获取照片数据并赋值给 images
    await this.fetchPhotos()
  },
  methods: {
    // 从后端获取照片
    async fetchPhotos() {
      try {
        const response = await fetchPublicPhotos(this.id) // 请求时传递当前用户ID
        if (response.code === 20000) {
          // 假设后端返回的数据格式符合 List<Map<String, Object>>，并且每个 map 包含了照片的详细信息和点赞状态
          this.images = response.data
        } else {
          this.$message.error('无法加载照片')
        }
      } catch (error) {
        console.error('获取照片时出错:', error)
        this.$message.error('加载照片失败')
      }
    },
    async handleLike(photoId) {
      try {
        const userId = this.id // 获取当前用户ID
        const response = await likePhoto(photoId, userId)

        if (response.code === 20000) {
          // 更新本地图片数据
          const photo = this.images.find(img => img.id === photoId)
          if (photo) {
            photo.liked = !photo.liked // 切换点赞状态
            photo.likeCount += photo.liked ? 1 : -1 // 根据点赞状态增加或减少点赞数
          }
        } else {
          // 显示后端返回的错误信息
          this.$message.error(response.message || '点赞失败')
        }
      } catch (error) {
        console.error('点赞时出错:', error)
        // 显示通用错误信息，但优先显示后端返回的具体失败消息
        this.$message.error(error.response?.data?.message || '点赞失败')
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  background-color: #f8f8f8;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: 30px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
}

.photo-img {
  max-width: 100%;
  display: block;
  transition: transform 0.5s ease-in-out;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 4px; /* 调小gap的值，减少按钮和数字间的间距 */
}

.like-count {
  margin-top: 8px;
  margin-left: 0px; /* 减少 margin-left 来缩小间距 */
  font-size: 14px;
  color: #555;
}

.like-button {
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-button.liked .heart {
  color: red;
}

.like-button .heart {
  font-size: 24px;
}

</style>
