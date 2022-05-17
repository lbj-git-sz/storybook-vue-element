import Axios from 'axios'
import qs from 'querystring'
import _ from 'lodash'
import Cache from './cache'

const $Cache = new Cache(Axios) // 将当前 axios 对象传入 Cache 中

const defaultConfig = {
  baseURL: '', // 请求的基地址
  headers: {
    'Content-Type': 'application/json;'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }, // 自定义的请求头
  method: 'GET', // 请求方法
  params: {}, // url get参数(post请求或默认的get参数)
  parseJson: true,
  timeout: 30000, // 请求的超时时间
  withCredentials: false, // 跨域请求是否发送第三方cookie
  setting: {
    showLoading: true, // 是否显示进度条
    loadingTime: 500, // 进度度x秒后显示
    showToast: true, // 是否显示错误弹窗
    storage_expire: 60 * 60 * 1000 * 2, // 本地缓存过期时间 默认2小时
    storage: true
  },
  cache: false,
  transformRequest: [
    function(data, headers) {
      const contentType = headers['Content-Type']
      if (contentType.indexOf('x-www-form-urlencoded') > -1) {
        return qs.stringify(data)
      } else {
        return JSON.stringify(data)
      } 
    }
  ]
}

const instance = Axios.create(defaultConfig)

class Fetch {
  constructor() {
    this.$axios = instance
    this.onceConfig = null
    this.timer = null
    this.interceptor = {
      // 请求前的拦截
      request: null,
      // 请求后的拦截
      responseSuc: null, // 成功
      responseErr: null // 错误、网络错误时
    }
    // 初始化拦截器
    this._initInterceptor()
    // 初始化请求
    this._initRequest()
  }
  _initRequest() {
    const methodArr = ['delete', 'get', 'post', 'put', 'postForm']
    const _this = this
    methodArr.forEach((methodName) => {
      _this[methodName] = _this._getFunc(methodName)
    })
  }

  _getFunc(methodName) {
    return (url, data = {}, setting = {}) => {
      if (methodName == 'postForm') {
        const config = this._deepObjectMerge(
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          },
          this.onceConfig
        )
        this.setOnceConfig(config)
      }
      return this.request({
        url,
        data,
        setting,
        method: methodName == 'postForm' ? 'POST' : methodName.toUpperCase()
      })
    }
  }
  _initInterceptor() {
    this.$axios.interceptors.request.use(async request => {
      // 清除临时的config配置
      this.clearOnceConfig()

      // 显示loading
      const { setting } = request
      if (setting.showLoading && !this.timer) {
        this.timer = setTimeout(() => {
          this.timer = null
        }, setting.loadingTime)
      }
      if (this._isFunction(this.interceptor.request)) {
        request = await this.interceptor.request(request)
      } 
      // 处理cache
      if (request.cache) {
        $Cache.useRequest(request)
      }
      return request
    })
    this.$axios.interceptors.response.use(
      async response => {
        clearTimeout(this.timer)
        this.timer = null
        let newResponse
        if (this._isFunction(this.interceptor.responseSuc)) {
          newResponse = await this.interceptor.responseSuc(response)
        } 
        // 处理cache
        if (response.config.cache) {
          $Cache.useResponse(response)
        }
        return newResponse || response
      },
      err => {
        clearTimeout(this.timer)
        this.timer = null
        if (Axios.isCancel(err)) return Promise.resolve(err.message.data)
        if (this._isFunction(this.interceptor.responseErr)) {
          return this.interceptor.responseErr(err)
        } else {
          return err
        }
      }
    )
  }
  _deepObjectMerge(target, source) {
    // 深度合并对象
    for (var key in source) {
      target[key] =
        target[key] && target[key].toString() === '[object Object]'
          ? this._deepObjectMerge(target[key], source[key])
          : (target[key] = source[key])
    }
    return target
  }
  _isFunction(obj) {
    return obj && typeof obj === 'function'
  }
  setConfig(extendConfig) {
    _.merge(this.$axios.defaults, extendConfig)
    return this
  }
  request(options) {
    const { url, data, method } = options
    const onceConfig = this.onceConfig || {}
    this.clearOnceConfig()

    return this.$axios.request({
      url,
      data,
      params: method === 'GET' ? data : '',
      method,
      ...onceConfig
    })
  }
  setOnceConfig(config = {}) {
    this.onceConfig = config
    return this
  }
  clearOnceConfig() {
    this.onceConfig = null
  }
}

export default new Fetch()
