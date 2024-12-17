import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取用户相册列表
export function fetchAlbumList(userId) {
  return request({
    url: '/album/list',
    method: 'get',
    params: { ownerId: userId } // 将用户ID传递给后端
  })
}

// 创建新相册
export function createAlbum(data) {
  // const userId = getToken()?.userId // 从登录信息中获取 userId
  return request({
    url: '/album/create',
    method: 'post',
    data: {
      ...data // 动态添加 ownerId
    }
  })
}

// 获取相册详情
export function fetchAlbumDetails(albumId) {
  return request({
    url: '/album/detail',
    method: 'get',
    params: { albumId } // 将相册 ID 传递给后端
  })
}

// 上传照片到相册
export function uploadPhoto(albumId, file) {
  const formData = new FormData() // 创建一个 FormData 对象
  formData.append('albumId', albumId) // 添加相册 ID
  formData.append('file', file) // 添加文件

  return request({
    url: '/album/upload-photo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 设置为 multipart/form-data 以处理文件上传
    },
    data: formData, // 传递 FormData 对象
    timeout: 100000
  })
}
// 删除相册中的图片
export function deletePhotoFromAlbum(photoId) {
  return request({
    url: `/album/deletePhoto/${photoId}`,
    method: 'delete'
  })
}
