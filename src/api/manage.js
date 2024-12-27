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

// 修改 fetchSchedule 方法，传递 userId
export function fetchSchedule(userId) {
  return request({
    url: `/manage/schedule`, // 请求 URL
    method: 'get',
    params: { id: userId } // 将 userId 传递给后端
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
