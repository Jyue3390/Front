import request from '@/utils/request'

// 获取课程列表
export function fetchCourseList() {
  return request({
    url: '/course/all',
    method: 'get'
  })
}

// 创建新课程
export function createCourse(data) {
  return request({
    url: '/course',
    method: 'post',
    data: {
      ...data // 动态添加课程数据
    }
  })
}

// 获取课程详情
export function fetchCourseDetails(courseId) {
  return request({
    url: `/course/${courseId}`,
    method: 'get'
  })
}

// 更新课程信息
export function updateCourse(courseId, data) {
  return request({
    url: `/course/${courseId}`,
    method: 'put',
    data: {
      ...data // 动态更新课程数据
    }
  })
}
export function submitQuestion(data) {
  return request({
    url: '/question/create',
    method: 'post',
    data: {
      ...data // 动态添加课程数据
    }
  })
}
// 删除课程
export function deleteCourse(courseId) {
  return request({
    url: `/course/${courseId}`,
    method: 'delete'
  })
}
