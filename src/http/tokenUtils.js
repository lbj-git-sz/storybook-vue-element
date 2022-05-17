import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
window.isRefreshing = false
let waitQueue = []
class TokenUtils {
  constructor(axios) {
    this.$axios = axios
    if (!this.$axios) throw new Error('缺少axios实例')
  }
  async logout() {
    Message.error({
      title: '错误提示',
      message: 'token更新失败，请重新登录...'
    })

    await store.dispatch('user/resetToken')
    await store.dispatch('user/resetRouter')
    router.replace({
      path: '/login'
    })
  }
  async refreshToken(response) {
    if (!window.isRefreshing) {
      window.isRefreshing = true

      await store
        .dispatch('user/refreshToken')
        .then(res => {
          if (res.code == 0) {
            // 刷新页面 重新请求
            MessageBox.confirm('登录信息已过期,请刷新界面', '系统提示', {
              confirmButtonText: '确定',
              type: 'error',
              showClose: false,
              showCancelButton: false
            }).then(() => {
              router.go(0)
            })
          } else {
            this.logout()
          }
        })
        .catch(() => {
          this.logout()
        })
        .finally(() => {
          // window.isRefreshing = false
        })
    }
  }

  async refreshTokenBak(response) {
    const { config } = response
    if (!window.isRefreshing) {
      window.isRefreshing = true

      await store
        .dispatch('user/refreshToken')
        .then(res => {
          if (res.code == 0) {
            config.headers['Authorization'] = 'Bearer ' + res.data.access_token
            config.baseURL = ''
            waitQueue.forEach((cb) => {
              cb(res.data.access_token)
            })
            waitQueue = []
            return this.$axios(config)
          } else {
            this.logout()
          }
        })
        .catch(() => {
          this.logout()
        })
        .finally(() => {
          window.isRefreshing = false
        })
    } else {
      return new Promise((resolve) => {
        waitQueue.push((token) => {
          config.headers['Authorization'] = 'Bearer ' + token
          config.baseURL = '' // 请求重试时，url已包含baseURL
          resolve(this.$axios(config))
        })
      })
    }
  }
}

export default TokenUtils
