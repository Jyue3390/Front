<template>
  <div>
    <h2>学生综合得分</h2>
    <table border="1">
      <thead>
        <tr>
          <th>学生 ID</th>
          <th>问题得分</th>
          <th>解答得分</th>
          <th>提问数量</th>
          <th>回答数量</th>
          <th>综合得分</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.studentId">
          <td>{{ student.studentId }}</td>
          <td>{{ student.questionScore }}</td>
          <td>{{ student.answerScore }}</td>
          <td>{{ student.askedCount }}</td>
          <td>{{ student.answeredCount }}</td>
          <td>{{ student.comprehensiveScore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchComprehensiveScores } from '@/api/general' // 导入API方法

export default {
  data() {
    return {
      students: [] // 存储学生数据
    }
  },
  created() {
    // 页面加载时调用异步方法获取数据
    this.loadStudentScores()
  },
  methods: {
    // 使用async/await获取数据
    async loadStudentScores() {
      try {
        const response = await fetchComprehensiveScores()
        // 检查响应的状态码
        if (response.code === 20000) {
          console.log('学生数据:', response.data) // 调试输出数据
          this.students = response.data // 将学生数据存储到 students 数组中
        } else {
          console.error('获取学生数据失败，状态码:', response.code) // 处理状态码错误
        }
      } catch (error) {
        console.error('获取学生数据失败:', error) // 错误处理
      }
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: center;
}
</style>
