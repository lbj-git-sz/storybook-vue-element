import Vue from 'vue'

import fetchInterceptor from '@/http/fetch.interceptor.js'
import fetch from '@/http/fetch.js'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import scAdminUI from 'sc-admin-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'

import i18n from './lang' // internationalization
import './utils/asyncPermission' // 权限管控，如果不需要做权限管控，在utils路径下直接引入permission.js替代
import locale from 'sc-admin-ui/src/locale/lang/zh-CN'

import _ from 'lodash'
import Storage from 'vue-ls'
import '@/directive/debounce.js' // 防抖
import '@/directive/throttle.js' // 节流

Vue.config.productionTip = false
Vue.prototype.$fetch = fetch
Vue.prototype._ = _

// vue-ls 本地化存储配置
const options = {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
}
Vue.use(Storage, options)
Vue.use(fetchInterceptor)
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(scAdminUI, { locale })

new Vue({
  el: '#app',
  i18n,
  render: h => h(App)
})
