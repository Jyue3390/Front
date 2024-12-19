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
          <!-- Like Button -->
          <button
            class="like-button"
            :class="{'liked': photo.liked}"
            @click="handleLike(photo.id)"
          >
            <span v-if="photo.liked" class="heart filled">❤️</span>
            <span v-else class="heart">🤍</span>
          </button>
          <span class="like-count">{{ photo.likeCount }}</span>
          <!-- Comment Button and Input -->
          <button
            class="comment-button"
            @click="toggleCommentInput(photo.id)"
          >
            💬
          </button>
          <div v-if="photo.showCommentInput" class="comment-input">
            <input
              v-model="photo.commentText"
              type="text"
              placeholder="发表评论..."
            >
            <button @click="handleComment(photo.id)">发布</button>
          </div>
          <!-- Share Button -->
          <!--          <button-->
          <!--            class="share-button"-->
          <!--            @click="toggleShareMenu(photo.id)"-->
          <!--          >-->
          <!--            📤-->
          <!--          </button>-->
          <el-dropdown
            class="share-dropdown"
            @command="command => handleShareCommand(command, photo)"
          >
            <button class="share-button" type="button">
              📤
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="copyLink">复制链接</el-dropdown-item>
                <el-dropdown-item command="downloadImage">下载图片</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- Display Comments -->
        <div class="comments">
          <div v-for="comment in photo.comments" :key="comment.id" class="comment">
            <p><strong>{{ comment.userName }}:</strong> {{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPublicPhotos, likePhoto, unlikePhoto, commentOnPhoto } from '@/api/general'
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
          this.images = response.data.map(photo => ({
            ...photo,
            comments: photo.comments || [],
            commentText: '', // 初始化评论输入框的文本
            showCommentInput: false, // 初始化评论输入框状态
            showShareMenu: false // 初始化分享菜单状态
          }))
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
        const userId = this.id
        const photo = this.images.find(img => img.id === photoId)

        if (!photo) return
        if (photo.liked) {
          this.$message.success('取消点赞')
          const response = await unlikePhoto(photoId, userId)
          if (response.code === 20000) {
            photo.liked = false
            photo.likeCount -= 1
          } else {
            this.$message.error(response.message || '取消点赞失败')
          }
        } else {
          const response = await likePhoto(photoId, userId)
          if (response.code === 20000) {
            photo.liked = true
            photo.likeCount += 1
          } else {
            this.$message.error(response.message || '点赞失败')
          }
        }
      } catch (error) {
        console.error('点赞时出错:', error)
        this.$message.error(error.response?.data?.message || '点赞失败')
      }
    },
    toggleCommentInput(photoId) {
      const photo = this.images.find(img => img.id === photoId)
      if (photo) {
        this.$set(photo, 'showCommentInput', !photo.showCommentInput)
      }
    },
    async handleComment(photoId) {
      const photo = this.images.find(img => img.id === photoId)
      if (photo && photo.commentText.trim()) {
        try {
          const userId = this.id
          const userName = this.name
          const comment = photo.commentText.trim()
          const response = await commentOnPhoto(photoId, userId, userName, comment)
          if (response.code === 20000) {
            photo.comments.push({
              id: response.data.id,
              userName: response.data.userName,
              content: comment
            })
            photo.commentText = ''
            photo.showCommentInput = false
          } else {
            this.$message.error(response.message || '评论失败')
          }
        } catch (error) {
          console.error('评论时出错:', error)
          this.$message.error('评论失败')
        }
      } else {
        this.$message.warning('评论不能为空')
      }
    },
    handleShareCommand(command, photo) {
      console.log('执行分享')
      if (!photo) return

      if (command === 'copyLink') {
        console.log('复制链接:', photo.url)
        navigator.clipboard.writeText(photo.url)
          .then(() => this.$message.success('链接已复制'))
          .catch(() => this.$message.error('复制链接失败'))
      } else if (command === 'downloadImage') {
        console.log('下载图片:', photo.url)
        const a = document.createElement('a')
        a.href = photo.url
        a.download = photo.url.split('/').pop() // 设置下载文件名
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
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
