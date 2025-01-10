<template>
  <div class="course-detail">
    <h1>{{ course.courseName }}</h1>
    <p><strong>课程描述:</strong> {{ course.description }}</p>
    <p><strong>课程类别:</strong> {{ course.category }}</p>
    <p><strong>类别描述:</strong> {{ course.categoryDescription }}</p>
    <p><strong>创建时间:</strong> {{ formatDate(course.createdAt) }}</p>

    <!-- 问题提交部分 -->
    <div class="question-section">
      <h3>提问</h3>
      <input v-model="questionTitle" type="text" placeholder="问题标题" class="question-input"/>
      <textarea v-model="questionDescription" placeholder="请输入问题描述..." rows="4"></textarea>
      <input v-model="questionCategory" type="text" placeholder="问题类别（例如：数据结构、树、二叉搜索）" class="question-input"/>
      <button @click="submitQuestion" :disabled="isSubmitting">提交问题</button>
      <p v-if="submitError" class="error-message">{{ submitError }}</p>
    </div>

    <!-- 展示课程问题 -->
    <div class="questions-list">
      <h3>已提问的问题</h3>
      <div v-if="questions.length === 0">暂无问题。</div>
      <div v-for="(question, index) in questions" :key="index" class="question-item">
        <h4>{{ question.title }}</h4>
        <p><strong>类别:</strong> {{ question.questionCategory }}</p>
        <p><strong>描述:</strong> {{ question.description }}</p>
        <p><strong>提问时间:</strong> {{ formatDate(question.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchCourseDetails, submitQuestion, fetchCourseQuestions } from '@/api/courses'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['roleid', 'username', 'name', 'role', 'id', 'token'])
  },
  data() {
    return {
      course: {},
      questionTitle: '',
      questionDescription: '',
      questionCategory: '',
      isSubmitting: false,
      submitError: '',
      questions: [] // 用于存储问题列表
    }
  },
  created() {
    this.fetchCourseDetail(this.$route.params.id) // 获取课程详情
    this.fetchQuestions(this.$route.params.id) // 获取课程问题
  },
  methods: {
    // 获取课程详情
    async fetchCourseDetail(courseId) {
      try {
        const response = await fetchCourseDetails(courseId)
        if (response.code === 20000) {
          this.course = response.data
        } else {
          this.$message.error('无法加载课程详情')
        }
      } catch (error) {
        console.error('获取课程详情时出错:', error)
        this.$message.error('加载课程详情失败')
      }
    },
    // 获取课程问题
    async fetchQuestions(courseId) {
      try {
        const response = await fetchCourseQuestions(courseId)
        if (response.code === 20000) {
          this.questions = response.data // 将问题列表赋值给 questions
        } else {
          this.$message.error('无法加载课程问题')
        }
      } catch (error) {
        console.error('获取课程问题时出错:', error)
        this.$message.error('加载课程问题失败')
      }
    },
    // 提交问题
    async submitQuestion() {
      if (this.questionTitle.trim() === '' || this.questionDescription.trim() === '') {
        this.submitError = '标题和描述不能为空！'
        return
      }

      this.isSubmitting = true
      this.submitError = '' // 清除之前的错误信息

      const question = {
        courseId: this.course.courseId,
        studentId: this.roleid,
        title: this.questionTitle,
        description: this.questionDescription,
        questionCategory: this.questionCategory
      }

      try {
        const response = await submitQuestion(question)
        if (response.code === 20000) {
          this.$message.success('问题提交成功！')
          this.questionTitle = '' // 清空标题输入框
          this.questionDescription = '' // 清空描述输入框
          this.questionCategory = '' // 清空类别输入框
          this.fetchQuestions(this.course.courseId) // 提交成功后刷新问题列表
        } else {
          this.submitError = '提交问题失败，请稍后再试'
        }
      } catch (error) {
        console.error('提交问题时出错:', error)
        this.submitError = '提交问题失败，请稍后再试'
      } finally {
        this.isSubmitting = false
      }
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.course-detail {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  color: #333;
}

p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
}

strong {
  font-weight: bold;
}

.question-section {
  margin-top: 30px;
}

.question-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background-color: #ccc;
}

.error-message {
  color: red;
  font-size: 0.9rem;
}

.questions-list {
  margin-top: 40px;
}

.question-item {
  margin-bottom: 20px;
}

.question-item h4 {
  font-size: 1.2rem;
  color: #333;
}

.question-item p {
  font-size: 1rem;
  color: #555;
}
</style>
