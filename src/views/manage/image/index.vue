<template>
  <div class="home">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">审核照片页面</h1>
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
        <div class="audit-button">
          <button
            class="audit"
            @click="handleAudit(photo.id, 1)"
          >
            <span>审核通过</span>
          </button>
          <button
            class="audit"
            @click="handleAudit(photo.id, 2)"
          >
            <span>审核不通过</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPhotos, updatePhotoAuditStatus } from '@/api/manage' // Add the API for updating audit status

export default {
  name: 'Home',
  data() {
    return {
      images: [] // 照片数据
    }
  },
  async created() {
    // 获取照片数据并赋值给 images
    await this.fetchPhoto()
  },
  methods: {
    // 从后端获取照片
    async fetchPhoto() {
      try {
        const response = await fetchPhotos()
        if (response.code === 20000) {
          console.log('获取成功')
          this.images = response.data
        } else {
          this.$message.error('无法加载照片')
        }
      } catch (error) {
        console.error('获取照片时出错:', error)
        this.$message.error('加载照片失败')
      }
    },
    // 处理审核按钮点击
    async handleAudit(photoId, status) {
      try {
        const response = await updatePhotoAuditStatus(photoId, status) // 调用更新接口
        if (response.code === 20000) {
          console.log('审核成功')
          this.$message.success(status === 1 ? '审核通过' : '审核不通过')

          // 更新本地图片状态并移除已审核的图片
          const photoIndex = this.images.findIndex(img => img.id === photoId)
          if (photoIndex !== -1) {
            this.images.splice(photoIndex, 1) // 从数组中移除该图片
          }
        } else {
          this.$message.error('审核失败')
        }
      } catch (error) {
        console.error('审核时出错:', error)
        this.$message.error('审核操作失败')
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  background-color: #f8f8f8;
  left: 54px; /* 距离左边20px */
  width: calc(100% - 54px); /* 总宽度减去左20px的空白 */
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
  gap: 4px;
}

.like-count {
  margin-top: 8px;
  margin-left: 0px;
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

.comment-button {
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.share-button {
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.comment-input {
  display: block;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.comment-input input {
  padding: 6px;
  width: 200px;
  font-size: 14px;
}

.comment-input button {
  padding: 6px;
  font-size: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

.comments {
  margin-top: 12px;
  text-align: left;
  width: 100%;
}

.comment {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.share-dropdown {
  display: inline-block;
}
</style>
