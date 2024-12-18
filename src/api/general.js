import request from '@/utils/request'

// 获取相册详情
export function fetchPublicPhotos() {
  return request({
    url: '/general/public',
    method: 'get',
    timeout: 100000
  })
}

// 点赞
export function likePhoto(photoId, userId) {
  return request({
    url: `/like/${photoId}/${userId}`,
    method: 'put'
  })
}

// 评论
export function commentOnPhoto(photoId, comment) {
  return request({
    url: `/general/comment/${photoId}`,
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
