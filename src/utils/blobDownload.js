import fetch from '@/http/fetch.js'
import {
  Message,
  MessageBox
} from 'element-ui'
export function downFile(options) {
  const {
    url, // api
    method = 'get',
    fileName = '', // 保存时的文件名,这里如果加了名字的话，默认就会使用这个格式下载，如果不写这个后缀话，就要再使用传参的时候将后缀规定好
    query = {}, // 请求参数
    progress = () => {}, // 下载进度
    successTips = false // 下载完成是否提示
  } = options
  fetch.setOnceConfig({
    responseType: 'blob', 
    setting: {
      showToast: false // 由于http封装，没有返回code码可能会默认提示网络错误，通过setting关闭提示
    },
    onDownloadProgress: (evt) => {
      console.log(evt)
      // 需要后端设置 content-length:(文件长度)
      const percentage = parseInt((evt.loaded / evt.total) * 100)
      console.log(percentage)
      progress(percentage)
      if (percentage >= 100 && successTips) {
        MessageBox({
          message: '<span style="font-size:20px"><i style="color:#67c23a" class="el-icon-success"></i> 下载已完成</span>',
          dangerouslyUseHTMLString: true,
          showClose: true,
          showConfirmButton: true
        })
      }
    }
  })[method](url, query).then((res) => {
    console.log(res)
    if (!res.data) return Message.error('下载数据为空')
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(new Blob([res.data]))
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  })
}
