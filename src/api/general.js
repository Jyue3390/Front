import request from '@/utils/request'

// 获取相册详情
export function fetchPublicPhotos() {
  return request({
    url: '/general/public',
    method: 'get',
    timeout: 100000
  })
}
