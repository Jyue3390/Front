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
            <h1>{{ photo.name }}</h1>
            <div class="icons">
              <a href="#" class="icon fas fa-heart" :class="{ 'liked': photo.liked }" @click.prevent="toggleLike(photo)" />
              <a href="#" class="icon fas fa-comment" @click.prevent="selectImage(photo)" />
              <a href="#" class="icon fas fa-share" @click.prevent="sharePhoto(photo)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPublicPhotos, likePhoto, commentOnPhoto, sharePhoto } from '@/api/general'
import user from '@/store/modules/user'

export default {
  name: 'Home',
  data() {
    return {
      images: [], // 原始照片数据
      currentImage: {}, // 当前放大的图片
      comment: '' // 存储用户输入的评论
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

    // 点赞功能
    async toggleLike(photo) {
      const previousLikedStatus = photo.liked // 保存原始点赞状态
      try {
        const response = await likePhoto(photo.id, user.id) // 调用 API
        if (response.code === 20000) {
          // 切换点赞状态
          photo.liked = !previousLikedStatus
          this.$message.success(photo.liked ? '点赞成功' : '取消点赞成功')
        } else {
          this.$message.error('点赞失败')
        }
      } catch (error) {
        console.error('点赞时出错:', error)
        this.$message.error('点赞失败')
      }
    },

    // 评论功能
    // async commentOnPhoto(photo) {
    //   try {
    //     const response = await commentOnPhoto(photo.id, this.comment)
    //     if (response.code === 20000) {
    //       this.$message.success('评论成功')
    //     } else {
    //       this.$message.error('评论失败')
    //     }
    //   } catch (error) {
    //     console.error('评论时出错:', error)
    //     this.$message.error('评论失败')
    //   }
    // },
    //
    // // 分享功能
    // async sharePhoto(photo) {
    //   try {
    //     const response = await sharePhoto(photo.id)
    //     if (response.code === 20000) {
    //       this.$message.success('分享成功')
    //     } else {
    //       this.$message.error('分享失败')
    //     }
    //   } catch (error) {
    //     console.error('分享时出错:', error)
    //     this.$message.error('分享失败')
    //   }
    // },

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
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.photo-img {
  max-width: 100%;
  display: block;
  transition: transform 0.5s ease-in-out;
}

.photo:hover .photo-img {
  transform: scale(1.1); /* 图片放大效果 */
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(100%);
  transition: transform 0.5s ease-in-out;
}

.photo:hover .image-overlay {
  transform: translateY(0); /* 鼠标悬停时遮罩从下方滑出 */
}
.image-overlay h1 {
  color: #fff;
  font-size: 20px;
  text-transform: uppercase;
  transform: translateY(20px);
  transition: transform 0.4s;
}

.image:hover .image-overlay h1 {
  transform: translateY(0);
}
.icons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.icon {
  text-decoration: none;
  color: #fff;
  font-size: 22px;
  margin: 0 10px;
  transform: translateY(80px);
  transition: transform 0.4s ease-in-out, color 0.4s;
}

.photo:hover .icon {
  transform: translateY(0);
}

.icon:nth-child(1) {
  transition: transform 0.4s 0.05s, color 0.4s;
}

.icon:nth-child(2) {
  transition: transform 0.4s 0.1s, color 0.4s;
}

.icon:nth-child(3) {
  transition: transform 0.4s 0.15s, color 0.4s;
}

.icon:hover {
  color: #3498db; /* 鼠标悬停时图标颜色变化 */
}
.liked {
  color: red;
}

.image-overlay::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 0px;
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
  transition: 0.5s;
}
.image:hover .image-overlay::before {
  height: 140px;
}
</style>
