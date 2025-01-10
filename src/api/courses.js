import request from '@/utils/request'

export function submitAnswerRating(answerId, score) {
  return request({
    url: `/answers/score/${answerId}`,
    method: 'put',
    params: { score }
  })
}

// 获取课程列表
export function fetchCourseList() {
  return request({
    url: '/course/all',
    method: 'get'
  })
}
// 设置问题为优秀问题
export function setExcellentQuestion(questionId) {
  return request({
    url: `/question/excellent/${questionId}`,
    method: 'put'
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
export function submitAnswer(data) {
  return request({
    url: `/answers/create`,
    method: 'post',
    data: {
      ...data // 动态添加课程数据
    }
  })
}
export function fetchQuestionAnswers(questionId) {
  return request({
    url: `/answers/question/${questionId}`,
    method: 'get'
    // data: {
    //   questionId
    // }
  })
}
export function fetchCourseQuestions(courseId) {
  return request({
    url: `/question/${courseId}/questions`,
    method: 'get'
  })
}
// 删除课程
export function deleteCourse(courseId) {
  return request({
    url: `/course/${courseId}`,
    method: 'delete'
  })
}
