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
      <input v-model="questionTitle" type="text" placeholder="问题标题" class="question-input">
      <textarea v-model="questionDescription" placeholder="请输入问题描述..." rows="4" />
      <input v-model="questionCategory" type="text" placeholder="问题类别（例如：数据结构、树、二叉搜索）" class="question-input">
      <button :disabled="isSubmitting" @click="submitQuestion">提交问题</button>
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
        <p><strong>评分:</strong> {{ question.score }}</p>
        <!-- Answer Section -->
        <button @click="toggleAnswerForm(question.id)">解答</button>

        <!-- Rating Section for Questions -->
        <div v-if="!question.hasRated">
          <input v-model="question.newScore" type="number" min="0" max="100" placeholder="评分">
          <button :disabled="isSubmitting" @click="submitRatingForQuestion(question)">
            提交评分
          </button>
        </div>
        <!-- Answer Submission Form -->
        <div v-if="question.showAnswerForm" class="answer-form">
          <textarea v-model="question.answerText" placeholder="请输入您的解答..." rows="4" />
          <button :disabled="isSubmitting" @click="submitAnswer(question)">提交解答</button>
        </div>

        <!-- Display Answers -->
        <div v-if="question.answers && question.answers.length > 0">
          <h5>已有解答:</h5>
          <div v-for="(answer, idx) in question.answers" :key="idx" class="answer-item">
            <p><strong>解答:</strong> {{ answer.content }}</p>
            <p><strong>时间:</strong> {{ answer.createdAt }}</p>
            <p><strong>解答者 ID:</strong> {{ answer.answererId }}</p> <!-- 显示解答者 ID -->
            <p><strong>评分:</strong> {{ answer.score }}</p> <!-- 显示评分 -->

            <!-- Rating Section -->
            <div v-if="!answer.hasRated">
              <input v-model="answer.newScore" type="number" min="0" max="100" placeholder="评分">
              <button :disabled="isSubmitting" @click="submitRating(answer, question)">提交评分</button>
            </div>
          </div>
        </div>

        <!-- Show 'No Answers' message if no answers -->
        <div v-if="question.noAnswersMessage" class="no-answers-message">
          <p>暂无解答</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchCourseDetails,
  submitQuestion,
  fetchCourseQuestions,
  submitAnswer,
  fetchQuestionAnswers,
  submitAnswerRating,
  submitQuestionRating
} from '@/api/courses'
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
          this.questions = response.data.map(question => ({
            ...question,
            id: question.questionId, // 将 questionId 映射为 id
            score: question.excellent,
            showAnswerForm: false, // Initially hide the answer form
            answerText: '', // For holding the answer input
            answers: [], // Initialize answers array
            noAnswersMessage: '', // Message when no answers are available
            hasRated: false,
            newScore: null
          }))
          for (const question of this.questions) {
            const answersResponse = await fetchQuestionAnswers(question.id)
            if (answersResponse.code === 20000) {
              if (answersResponse.data.length === 0) {
                question.noAnswersMessage = '暂无解答'
              } else {
                question.answers = answersResponse.data.map(answer => ({
                  ...answer,
                  id: answer.answerId,
                  content: answer.content,
                  createdAt: this.formatDate(answer.createdAt),
                  answererId: answer.answererId,
                  score: answer.score,
                  hasRated: false,
                  newScore: null
                }))
              }
            } else {
              this.$message.error('无法加载问题解答')
            }
          }
        } else {
          this.$message.error('无法加载课程问题')
        }
      } catch (error) {
        console.error('获取课程问题时出错:', error)
        this.$message.error('加载课程问题失败')
      }
    },
    // Toggle the answer form visibility
    toggleAnswerForm(questionId) {
      const question = this.questions.find(q => q.id === questionId)
      question.showAnswerForm = !question.showAnswerForm
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
          this.questionTitle = ''
          this.questionDescription = ''
          this.questionCategory = ''
          this.fetchQuestions(this.course.courseId)
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
    // 提交问题评分
    async submitRatingForQuestion(question) {
      if (question.newScore == null || question.newScore < 0 || question.newScore > 100) {
        this.$message.warning('请提供有效的评分（0-100）')
        return
      }
      try {
        const response = await submitQuestionRating(question.id, question.newScore) // 提交评分
        if (response.code === 20000) {
          question.hasRated = true
          this.$message.success('评分提交成功')
          this.fetchQuestions(this.course.courseId)
        } else {
          this.$message.error('评分提交失败')
        }
      } catch (error) {
        console.error('评分提交时出错:', error)
        this.$message.error('评分提交失败，请稍后再试')
      }
    },
    // 提交解答
    async submitAnswer(question) {
      if (question.answerText.trim() === '') {
        this.$message.warning('请填写解答内容')
        return
      }

      const answer = {
        questionId: question.id,
        answererId: this.roleid,
        content: question.answerText
      }

      this.isSubmitting = true

      try {
        const response = await submitAnswer(answer)
        if (response.code === 20000) {
          question.answerText = ''
          this.$message.success('解答提交成功')
          this.fetchQuestions(this.course.courseId)
        } else {
          this.$message.error('解答提交失败')
        }
      } catch (error) {
        console.error('提交解答时出错:', error)
        this.$message.error('提交解答失败，请稍后再试')
      } finally {
        this.isSubmitting = false
      }
    },
    // 提交评分（解答）
    async submitRating(answer, question) {
      if (answer.newScore == null || answer.newScore < 0 || answer.newScore > 100) {
        this.$message.warning('请提供有效的评分（0-100）')
        return
      }

      try {
        const response = await submitAnswerRating(answer.id, answer.newScore)
        if (response.code === 20000) {
          answer.hasRated = true
          this.$message.success('评分提交成功')
          this.fetchQuestions(this.course.courseId)
        } else {
          this.$message.error('评分提交失败')
        }
      } catch (error) {
        console.error('评分提交时出错:', error)
        this.$message.error('评分提交失败')
      }
    },
    // 格式化日期
    formatDate(date) {
      const d = new Date(date)
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
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

.answer-form {
  margin-top: 15px;
}

.answer-form textarea {
  width: 100%;
  padding: 10px;
}

.answer-item {
  margin-top: 10px;
}

.answer-item p {
  font-size: 1rem;
  color: #444;
}
</style>
