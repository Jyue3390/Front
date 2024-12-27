<template>
  <div class="home">
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Sidebar: 科室选择 -->
      <div class="sidebar">
        <h3>挂号 选择科室</h3>
        <ul class="department-list">
          <li
            v-for="department in departments"
            :key="department.departmentId"
            :class="{'active': selectedDepartment && selectedDepartment.departmentId === department.departmentId}"
            @click="selectDepartment(department)"
          >
            {{ department.departmentName }}
          </li>
        </ul>
      </div>

      <!-- Right Content: 显示选中的科室信息 -->
      <div class="department-info">
        <h3 v-if="selectedDepartment">科室信息: {{ selectedDepartment.departmentName }}</h3>
        <p v-if="selectedDepartment">{{ selectedDepartment.description }}</p>
        <p v-if="selectedDepartment">联系电话: {{ selectedDepartment.contactNumber }}</p>
        <p v-if="selectedDepartment">科室位置: {{ selectedDepartment.location }}</p>
        <p v-if="selectedDepartment">负责人: {{ selectedDepartment.responsibleId }}</p>

        <!-- 显示医生信息 -->
        <div v-if="doctors.length > 0">
          <h3>医生信息:</h3>
          <ul>
            <li v-for="doctor in doctors" :key="doctor.id">
              <strong>{{ doctor.name }}</strong><br>
              专业: {{ doctor.specialty }}<br>
              职称: {{ doctor.title }}<br>
              工号: {{ doctor.workId }}<br>
              专业领域: {{ doctor.specialty }}<br>
              联系电话: {{ doctor.contactNumber }}<br>

              <!-- 显示该医生的排班信息 -->
              <div v-if="doctor.schedule && doctor.schedule.length > 0">
                <h4>排班信息:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>开始时间</th>
                      <th>结束时间</th>
                      <th>剩余号源</th>
                      <th>操作</th>
                    </tr>
                  </thead>
<!--                  <tbody>-->
<!--                    <tr v-for="schedule in doctor.schedule" :key="schedule.visitTimeId">-->
<!--                      <td>{{ schedule.visitDate }}</td>-->
<!--                      <td>{{ schedule.startTime }}</td>-->
<!--                      <td>{{ schedule.endTime }}</td>-->
<!--                      <td>{{ schedule.slotCount }}</td>-->
<!--                      <td>-->
<!--                        <button-->
<!--                          :disabled="schedule.slotCount === 0"-->
<!--                          @click="makeAppointment(doctor.id, schedule.visitTimeId)"-->
<!--                        >-->
<!--                          预约-->
<!--                        </button>-->
<!--                      </td>-->
<!--                    </tr>-->
<!--                  </tbody>-->
                  <tbody>
                    <tr v-for="schedule in doctor.schedule" :key="schedule.visitTimeId">
                      <td>{{ schedule.visitDate }}</td>
                      <td>{{ schedule.startTime }}</td>
                      <td>{{ schedule.endTime }}</td>
                      <td>{{ schedule.slotCount }}</td>
                      <td>
                        <button
                          :disabled="schedule.slotCount === 0 && !schedule.isReserved"
                          @click="schedule.isReserved ? cancelAppointment(doctor.id, schedule.visitTimeId, true) : makeAppointment(doctor.id, schedule.visitTimeId, false)"
                        >
                          {{ schedule.isReserved ? "已预约，取消预约" : "预约" }}
                        </button>
                      </td>
                    </tr>
                  </tbody>

                </table>
              </div>
              <div v-else>
                <p>没有排班信息</p>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="doctors.length === 0 && selectedDepartment">
          <p>该科室暂时没有医生信息。</p>
        </div>

        <div v-if="!selectedDepartment" class="placeholder">
          <p>请从左侧选择一个科室以查看信息。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDepartments, fetchDoctors, makeAppointment } from '@/api/general'

export default {
  name: 'Home',
  data() {
    return {
      departments: [],
      selectedDepartment: null,
      doctors: []
    }
  },
  async created() {
    await this.fetchDepartments()
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await fetchDepartments()
        if (response.code === 20000) {
          this.departments = response.data
        } else {
          this.$message.error('无法加载科室数据')
        }
      } catch (error) {
        console.error('获取科室数据时出错:', error)
        this.$message.error('加载科室数据失败')
      }
    },
    async selectDepartment(department) {
      this.selectedDepartment = department
      this.doctors = []
      try {
        const response = await fetchDoctors(department.departmentId)
        if (response.code === 20000) {
          // 初始化医生信息及预约状态
          this.doctors = response.data.map((doctor) => {
            if (doctor.schedule) {
              doctor.schedule = doctor.schedule.map((schedule) => ({
                ...schedule,
                isReserved: false // 初始化为未预约状态
              }))
            }
            return doctor
          })
        } else {
          this.$message.error('该科室没有医生信息')
        }
      } catch (error) {
        console.error('获取医生数据时出错:', error)
        this.$message.error('加载医生数据失败')
      }
    },
    async makeAppointment(doctorId, visitTimeId, isCancel = false) {
      try {
        const response = await makeAppointment({ doctorId, visitTimeId, isCancel }) // 传入 isCancel 参数
        if (response.code === 20000) {
          if (isCancel) {
            this.$message.success('取消预约成功！')
          } else {
            this.$message.success('预约成功！')
          }
          // 更新排班状态
          const doctor = this.doctors.find((d) => d.id === doctorId)
          const schedule = doctor.schedule.find((s) => s.visitTimeId === visitTimeId)
          schedule.isReserved = !isCancel // 反转预约状态
          schedule.slotCount += isCancel ? 1 : -1 // 取消预约则增加号源，否则减少号源
        } else {
          this.$message.error(`${isCancel ? '取消预约失败' : '预约失败'}：${response.message}`)
        }
      } catch (error) {
        console.error(`${isCancel ? '取消预约失败' : '预约失败'}:`, error)
        this.$message.error(`${isCancel ? '取消预约失败' : '预约失败'}，请稍后再试`)
      }
    },
    // async cancelAppointment(doctorId, visitTimeId) {
    //   try {
    //     const response = await makeAppointment({ doctorId, visitTimeId, cancel: true }) // 假设后端支持取消预约
    //     if (response.code === 20000) {
    //       this.$message.success('取消预约成功！')
    //       // 更新排班状态
    //       const doctor = this.doctors.find((d) => d.id === doctorId)
    //       const schedule = doctor.schedule.find((s) => s.visitTimeId === visitTimeId)
    //       schedule.isReserved = false // 标记为未预约
    //       schedule.slotCount += 1 // 剩余号源加 1
    //     } else {
    //       this.$message.error(`取消预约失败：${response.message}`)
    //     }
    //   } catch (error) {
    //     console.error('取消预约失败:', error)
    //     this.$message.error('取消预约失败，请稍后再试')
    //   }
    // }
  }
}
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.main-layout {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
}

.sidebar h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.department-list {
  list-style-type: none;
  padding: 0;
}

.department-list li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.department-list li:hover {
  background-color: #5a9ef3;
}

.department-list li.active {
  background-color: #accff8;
  color: white;
}

.department-info {
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  margin-left: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

table th {
  background-color: #f4f4f4;
}

button {
  padding: 5px 10px;
  background-color: #5a9ef3;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button.active {
  background-color: #ff6f61; /* 取消预约按钮的颜色 */
}

</style>
