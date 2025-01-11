import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      ...data
    }
  })
}
export function uploadPhoto(userId, file) {
  const formData = new FormData() // 创建一个 FormData 对象
  formData.append('userId', userId) // 添加相册 ID
  formData.append('file', file) // 添加文件

  return request({
    url: '/user/avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 设置为 multipart/form-data 以处理文件上传
    },
    data: formData, // 传递 FormData 对象
    timeout: 100000
  })
}
// 新增接口：修改用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data // 传递需要更新的数据
  })
}
// 获取用户信息通过用户ID
export function getUserInfoById(userId) {
  return request({
    url: `/user/${userId}`, // 假设后端接口为 /user/{userId}
    method: 'get'
  })
}

