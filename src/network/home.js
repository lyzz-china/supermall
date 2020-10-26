import {request} from "./request";

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type,page) {
  return request({
    url:'/home/data',
    params: {
      type,
      page
    }
  })
}

// const totalNums = []
// const nums = [20,11,22]
//
// totalNums = nums
