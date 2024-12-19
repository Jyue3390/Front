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
