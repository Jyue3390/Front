<template>
  <div class="home">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">审核评论页面</h1>
    </div>
    <!-- Display Comments -->
    <div class="comments">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p><strong>{{ comment.userName }}:</strong> {{ comment.content }}</p>
        <div class="audit-buttons">
          <button @click="handleAudit(comment.id, 1)">审核通过</button>
          <button @click="handleAudit(comment.id, 2)">审核不通过</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchComments, updateCommentAuditStatus } from '@/api/manage' // API for fetching and updating comment status

export default {
  name: 'Home',
  data() {
    return {
      comments: [] // Comment data array
    }
  },
  async created() {
    // Fetch comments when the component is created
    await this.fetchComments()
  },
  methods: {
    // Fetch comments with audit_status = 0
    async fetchComments() {
      try {
        const response = await fetchComments() // This should fetch the comments with audit_status = 0
        if (response.code === 20000) {
          this.comments = response.data // Set comments to the fetched data
        } else {
          this.$message.error('无法加载评论')
        }
      } catch (error) {
        console.error('获取评论时出错:', error)
        this.$message.error('加载评论失败')
      }
    },
    // Handle comment audit (approve or reject)
    async handleAudit(commentId, status) {
      try {
        const response = await updateCommentAuditStatus(commentId, status) // Update audit status
        if (response.code === 20000) {
          this.$message.success(status === 1 ? '审核通过' : '审核不通过')
          // After updating, remove the comment from the list
          this.comments = this.comments.filter(comment => comment.id !== commentId)
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
