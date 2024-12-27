import request from '@/utils/request'

// 获取科室列表
export function fetchDepartments() {
  return request({
    url: '/general/departments', // Replace with the actual endpoint for fetching departments
    method: 'get'
  })
}
// 获取医生信息
export function fetchDoctors(departmentId) {
  return request({
    url: `/general/doctors?departmentId=${departmentId}`,
    method: 'get'
  })
}

// 发起预约请求或取消预约请求
// 发起预约请求或取消预约请求
export function makeAppointment({ visitTimeId, doctorId, isCancel }) {
  return request({
    url: '/general/appointment', // 始终调用同一个接口
    method: 'post',
    data: { visitTimeId, doctorId, isCancel } // 传递 isCancel 来决定操作
  })
}

