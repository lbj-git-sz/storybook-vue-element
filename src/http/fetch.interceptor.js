import TokenUtils from './tokenUtils'

const install = (Vue, vm) => {
  const $fetch = Vue.prototype.$fetch
  const $TokenUtils = new TokenUtils($fetch.$axios)

  $fetch.setConfig({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 40000,
    /*  对特定数据处理 */
    formatData: false
  })
  /* // 请求前拦截 */
  $fetch.interceptor.request = request => {
    return Promise.resolve(request)
  }
  /* // 请求后拦截--请求成功 */
  $fetch.interceptor.responseSuc = async response => {
    // access_token失效过期，通过refresh_token刷新
    if (response.data.code == '20006') {
      await $TokenUtils.refreshToken(response)
    }
    return Promise.resolve(response)
  }
  /*   // 请求后拦截--网络错误时、请求失败、服务器错误 */
  $fetch.interceptor.responseErr = err => {
    const { response } = err
    return response?.data || err
  }
}

export default {
  install
}
