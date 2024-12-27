<template>
  <div class="schedule">
    <!-- Header -->
    <div class="header">
      <h1 class="page-title">医生排班信息</h1>
    </div>
    <!-- Display Schedule -->
    <div class="schedule-list">
      <table>
        <thead>
        <tr>
          <th>医生ID</th>
          <th>排班日期</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>号源总数</th>
          <th>已预约数</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in schedule" :key="item.visitTimeId">
          <td>{{ item.doctorId }}</td>
          <td>{{ formatDate(item.visitDate) }}</td>
          <td>{{ formatTime(item.startTime) }}</td>
          <td>{{ formatTime(item.endTime) }}</td>
          <td>{{ item.slotCount }}</td>
          <td>{{ item.now }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { fetchSchedule } from '@/api/manage' // API for fetching schedule
import { mapGetters } from 'vuex'

export default {
  name: 'Schedule',
  data() {
    return {
      schedule: [] // 排班数据数组
    }
  },
  computed: {
    // 使用 Vuex 获取 userId
    ...mapGetters(['userId'])
  },
  async created() {
    // 在组件创建时加载排班数据
    await this.fetchSchedule()
  },
  methods: {
    // 获取排班数据
    async fetchSchedule() {
      try {
        // 获取 Vuex 中的 userId
        const response = await fetchSchedule(this.userId) // 传递 userId 给后端
        if (response.code === 20000) {
          this.schedule = response.data // 设置排班数据
        } else {
          this.$message.error('无法加载排班信息')
        }
      } catch (error) {
        console.error('获取排班信息时出错:', error)
        this.$message.error('加载排班信息失败')
      }
    },
    // 格式化日期
    formatDate(date) {
      return new Date(date).toLocaleDateString() // 格式化日期为本地日期格式
    },
    // 格式化时间
    formatTime(time) {
      return new Date(`1970-01-01T${time}Z`).toLocaleTimeString() // 格式化时间
    }
  }
}
</script>

<style scoped>
.schedule {
  padding: 20px;
  background-color: #f8f8f8;
  text-align: center;
}

.page-title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}

.schedule-list {
  margin-top: 20px;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td {
  font-size: 14px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>
