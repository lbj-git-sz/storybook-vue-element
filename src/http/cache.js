
let CACHES = {}
const PREFIX = 'API_CACHE_'
const ALL_EXPIRE = 60 * 60 * 1000 * 24 * 7 // 接口缓存全部过期时间

class Cache {
  constructor(axios, options) {
    this.axios = axios
    if (!this.axios) throw new Error('缺少axios实例')
    this.cancelToken = axios.CancelToken
    
    this._storageExpire('ALL_EXPIRE').then(() => {
      CACHES = {}
      mapStorage(localStorage, 'get')
    })
  }

  useRequest(config) {
    if (config.cache) {
      const source = this.cancelToken.source()
      config.cancelToken = source.token
      const data = CACHES[this._regHttp(config.baseURL + config.url)]
      const nowTime = getNowTime()
      // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
      if (data && nowTime - data.createTime < data.storage_expire) {
        console.log('返回接口缓存数据')
        source.cancel(data)
      } else {
        console.log('返回接口请求数据')
      }
    }
  }
  useResponse(response) {
    const { storage, storage_expire } = response.config.setting
    if (response.config.cache) {
      console.log('设置接口缓存数据')
      const data = {
        storage_expire: storage_expire,
        createTime: getNowTime(),
        data: response.data
      }

      CACHES[this._regHttp(response.config.url)] = data
      if (storage) mapStorage(CACHES)
    }
  }
  _regHttp(url = '') {
    var reg = /^http(s)?:\/\/(.*?)\//
    return PREFIX + url.replace(reg, '')
  }
  // 本地缓存过期判断
  _storageExpire(cacheKey) {
    return new Promise(resolve => {
      const key = getStorage(cacheKey)
      const date = getNowTime()
      if (key) {
        // 缓存存在 判断是否过期
        const isExpire = date - key < ALL_EXPIRE
        // 如果过期 则重新设定过期时间 并清空缓存
        if (!isExpire) {
          mapStorage(localStorage, 'del')
        }
      } else {
        setStorage(cacheKey, date)
      }
      resolve()
    })
  }
}

/**
 * caches: 缓存列表
 * type: set->存 get->取
 */
function mapStorage(caches, type = 'set') {
  Object.entries(caches).map(([key, cache]) => {
    if (key.indexOf(PREFIX) > -1) {
      if (type === 'set') {
        setStorage(key, cache)
      } else if (type === 'del') {
        const data = JSON.parse(caches[key])
        // 接口缓存时间小于就删除，避免占用多余内存
        if (data.storage_expire < ALL_EXPIRE) {
          localStorage.removeItem(key)
        }
      } else {
        // 正则太弱 只能简单判断是否是json字符串
        const reg = /\{/g
        if (reg.test(cache)) CACHES[key] = JSON.parse(cache)
        else CACHES[key] = cache
      }
    }
  })
}

// 设置缓存
function setStorage(key, cache) {
  localStorage.setItem(key, JSON.stringify(cache))
}

// 获取缓存
function getStorage(key) {
  const data = localStorage.getItem(key)
  return JSON.parse(data)
}

// 设置过期时间
function getNowTime() {
  return new Date().getTime()
}
export default Cache
