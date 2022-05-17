import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import ScSelect from '@/components/ScSelect'

export default {
  title: 'Common/sc-select',
  component: ScSelect
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScSelect },
  template: `<sc-select v-bind="$props" />`
})

export const 参数说明 = Template.bind({})
参数说明.parameters = {
  viewMode: 'docs',
  previewTabs: {
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  }
}
export const 基础用法 = Template.bind({})
基础用法.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `给组件配置url让组件自动发送请求，如果需要额外请求参数通过params配置，如果需要对接口返回来的参数进行过滤则配置filterParams` 
    },
    source: {
      code: 
        `<template>
          <sc-select
            v-model="value1"
            url="/api/getData"
            :params="params"
            val-key="valKey"
            label-key="labelKey"
          />
        </template>
        <scirpt>
          export default {
            data() {
              return {
                value1: null,
                params: {}
              }
            }
          }
        </script>`
    }
  }
}
export const 直接传入下拉数据 = () => ({
  template: `
    <div>
      <sc-select v-model="value1" :res-data="resData1" />
    </div>`,
  components: { ScSelect },
  data() {
    return {
      resData1: [{ label: 'aa', value: '11' }, { label: 'bb', value: '22' }],
      value1: null
    }
  }
})
直接传入下拉数据.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `有的页面中不同的字段（通过本组件渲染）是通过同一个接口数据中取得的，为了避免同一时间发出多个相同的请求，应该先发一个接口请求得到结果数据后直接传入组件中渲染。
              另外, 直接传入resData之后将不会再发请求，所以url和params都无需配置了。` 
    },
    source: {
      code: `<template>
        <sc-select
          v-model="value1"
          :res-data="portList"
          val-key="portCode"
          label-key="portChineseName"
        />
      </template>
      <scirpt>
        export default {
          data() {
            return {
              value1: null,
              portList: []
            }
          },
          created() {
            this.getPortList()
          },
          methods: {
            async getPortList() {
              const { data, code } = await this.$fetch.post('/tms-basecenter/basicData/findPortInfo', {})
              if (code === 0) {
                this.portList = [{ portChineseName: '全部', portCode: '' }, ...data.records]
              }
            }
          }
        }
      </script>`
    }
  }
}

export const 级联选择 = () => ({
  template: `<div>
    <sc-select v-model="value1" :res-data="resData1" @change="onChange1" />
    <p />
    <sc-select v-model="value2" :res-data="resData2" />
  </div>`,
  components: { ScSelect },
  data() {
    return {
      resData1: [{ label: 'aa', value: '11' }, { label: 'bb', value: '22' }],
      resData2: [{ label: 'aa-aa', value: '111' }, { label: 'bb-bb', value: '222' }],
      value1: null,
      value2: null
    }
  },
  methods: {
    onChange1(item) {
      this.value2 = null
      if (item.value === '22') {
        this.resData2 = [{ label: 'bb-bb', value: '222' }]
      } else {
        this.resData2 = [{ label: 'aa-aa', value: '111' }]
      }
    }
  }
})
级联选择.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `级联选择主要是将上级字段选择的结果通过params传给下级字段。` 
    },
    source: {
      code: `<template>
        <sc-select
          v-model="value1"
          url="/api/getData1"
          val-key="valKey"
          label-key="labelKey"
        />
        <sc-select
          v-model="value2"
          url="/api/getData2"
          :params="{ key: value1 }"
          val-key="valKey"
          label-key="labelKey"
        />
      </template>
      <scirpt>
        export default {
          data() {
            return {
              value1: null,
              value2: null
            }
          }
        }
      </script>`
    }
  }
}
export const 远程搜索 = () => ({
  template: `    
    <sc-select
      v-model="value1"
      url="/api/getData"
      isRemote="true"
    />`,
  components: { ScSelect },
  data() {
    return {
      value1: null
    }
  }
})
远程搜索.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `远程搜索配置Remote为true。` 
    },
    source: {
      code: `<template>
        <sc-select
          v-model="value"
          url="/api/getData2"
          remote="true"
        />
      </template>
      <scirpt>
        export default {
          data() {
            return {
              value: null,
          
            }
          }
        }
      </script>`
    }
  }
}
