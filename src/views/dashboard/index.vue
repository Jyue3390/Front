<template>
  <div id="app">
    <main>
      <div class="user-info">
        <div class="info">
          <label>用户名:</label>
          <span>{{ name }}</span>
        </div>
      </div>

      <div v-if="role === 'doctor' && userDetails" class="user-details">
        <h3>医生详情</h3>
        <p><strong>姓名:</strong> {{ userDetails.name }}</p>
        <p><strong>部门ID:</strong> {{ userDetails.departmentid }}</p>
        <p><strong>专长:</strong> {{ userDetails.specialty }}</p>
        <p><strong>职称:</strong> {{ userDetails.title }}</p>
        <p><strong>工作编号:</strong> {{ userDetails.workid }}</p>
        <p><strong>联系电话:</strong> {{ userDetails.contactnumber }}</p>
        <p><strong>在岗状态:</strong> {{ userDetails.ondutystatus ? '是' : '否' }}</p>
      </div>

      <div v-if="role === 'patient' && userDetails" class="user-details">
        <h3>患者详情</h3>
        <p><strong>姓名:</strong> {{ userDetails.name }}</p>
        <p><strong>年龄:</strong> {{ userDetails.age }}</p>
        <p><strong>性别:</strong> {{ userDetails.gender }}</p>
        <p><strong>生日:</strong> {{ userDetails.birthday }}</p>
        <p><strong>电话:</strong> {{ userDetails.phone }}</p>
        <p><strong>身份证号:</strong> {{ userDetails.idcard }}</p>
        <p><strong>医保卡号:</strong> {{ userDetails.medicalcard }}</p>
        <p><strong>病情:</strong> {{ userDetails.illness }}</p>
        <p><strong>地址:</strong> {{ userDetails.address }}</p>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserDetails } from '@/api/user'

export default {
  name: 'UserProfile',
  computed: {
    ...mapState('user', [
      'name', // 映射用户名
      'userId', // 映射用户ID
      'role' // 映射用户角色
    ])
  },
  data() {
    return {
      userDetails: {} // 用于存储医生或患者详细信息
    }
  },
  mounted() {
    if (this.userId) {
      console.log('UserId is:', this.userId) // 输出 userId
      this.fetchDetails() // 页面加载时获取用户信息
    } else {
      console.log('UserId is not set yet')
      this.$watch('userId', (newUserId) => {
        if (newUserId) {
          console.log('UserId has been set:', newUserId)
          this.fetchDetails()
        }
      })
    }
  },
  methods: {
    async fetchDetails() {
      try {
        console.log('请求参数:', { role: this.role, name: this.name, userId: this.$store.state.user.userId }) // 打印发送给后端的参数
        const response = await getUserDetails(this.role, this.$store.state.user.userId)
        console.log('后端返回数据:', response) // 打印后端返回的数据
        if (response.code === 20000) {
          this.userDetails = response.data // 直接绑定 Map 数据
          console.log('Parsed userDetails:', this.userDetails)
        } else {
          alert(response.message || '查询失败')
        }
      } catch (error) {
        console.error('获取用户信息出错:', error) // 打印错误信息
        alert('获取信息失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 50px;
}

.user-info {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.info {
  text-align: left;
}

.user-details {
  margin-top: 30px;
  text-align: left;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
