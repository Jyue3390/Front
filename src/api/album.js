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
      ...data// ,// ownerId: userId // 动态添加 ownerId
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
// 添加图片到相册
export function addPhotoToAlbum(data) {
  return request({
    url: '/album/addPhoto',
    method: 'post',
    data // 包含相册ID和图片信息
  })
}

// 删除相册中的图片
export function deletePhotoFromAlbum(photoId) {
  return request({
    url: `/album/deletePhoto/${photoId}`,
    method: 'delete'
  })
}
