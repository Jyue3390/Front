import request from '@/utils/request'

// 定义获取学生综合能力分的请求函数
export function fetchComprehensiveScores() {
  return request({
    url: '/students/comprehensive-scores', // 后端接口地址
    method: 'get' // 请求方式
  })
}
