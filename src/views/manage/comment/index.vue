<template>
  <div class="course-container">
    <div v-for="(courses, category) in groupedCourses" :key="category" class="category-section">
      <h2>{{ category }}</h2>
      <div class="course-list">
        <div v-for="course in courses" :key="course.courseId" class="course-item">
          <h3>{{ course.courseName }}</h3>
          <p>{{ course.description }}</p>
          <!-- 点击按钮时跳转到课程详情页面 -->
          <button @click="viewCourseDetails(course.courseId)">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchCourseList } from '@/api/courses' // 导入 fetchCourseList 接口

export default {
  data() {
    return {
      courseList: [] // 存储课程列表
    }
  },
  computed: {
    groupedCourses() {
      // 按课程类别分组
      return this.courseList.reduce((groups, course) => {
        const category = course.category || '未分类'
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(course)
        return groups
      }, {})
    }
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await fetchCourseList() // 使用导入的接口函数
        this.courseList = response.data
      } catch (error) {
        console.error('获取课程失败', error)
      }
    },
    viewCourseDetails(courseId) {
      // 跳转到课程详情页，传递课程ID
      this.$router.push({ name: 'Image', params: { id: courseId }})
    }
  }
}
</script>

<style scoped>
.course-container {
  padding: 20px;
}

.category-section {
  margin-bottom: 30px;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
}

.course-item {
  width: 30%;
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h3 {
  font-size: 1.2rem;
  margin: 10px 0;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>
