import request from '@/utils/request'

// 获取未审核照片
export function fetchPhotos() {
  return request({
    url: '/manage/photos',
    method: 'get'
  })
}
export function updatePhotoAuditStatus(photoId, status) {
  return request({
    url: `/manage/${photoId}/audit`,
    method: 'put',
    data: {
      auditStatus: status
    }
  })
}

export function fetchComments() {
  return request({
    url: '/manage/comments',
    method: 'get'
  })
}
export function updateCommentAuditStatus(Id, status) {
  return request({
    url: `/manage/comments/${Id}/audit`,
    method: 'put',
    data: {
      auditStatus: status
    }
  })
}
// 禁言用户接口
export function muteUserViolation(userId) {
  return request({
    url: `/manage/users/${userId}/violation`,
    method: 'put',
    data: {
      violation: 1 // 1 means the user is muted
    }
  })
}
