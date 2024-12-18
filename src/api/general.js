import request from '@/utils/request'

// 获取相册详情
export function fetchPublicPhotos(userId) {
  return request({
    url: '/general/public',
    method: 'get',
    params: { userId: userId },
    timeout: 100000
  })
}

// 点赞
export function likePhoto(photoId, userId) {
  return request({
    url: `/general/like/${photoId}/${userId}`,
    method: 'put'
  })
}

// 评论
export function commentOnPhoto(photoId, userId, comment) {
  return request({
    url: `/general/comment/${photoId}/${userId}`,
    method: 'post',
    data: { comment },
    timeout: 100000
  })
}

// 分享
export function sharePhoto(photoId) {
  return request({
    url: `/general/share/${photoId}`,
    method: 'post',
    timeout: 100000
  })
}
