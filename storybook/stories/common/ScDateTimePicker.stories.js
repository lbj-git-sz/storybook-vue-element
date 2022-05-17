import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import '@/styles/dateTimePicker.scss'
import ScDateTimePicker from '@/components/ScDateTimePicker'
import ScSelect from '@/components/ScSelect'

export default {
  title: 'Common/sc-date-time-picker',
  component: ScDateTimePicker,
  decorators: [() => ({ template: '<div style="width: 400px;"><story/></div>' })]
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScDateTimePicker },
  template: `<sc-date-time-picker v-bind="$props" v-model="date" />`,
  data() {
    return {
      date: ''
    }
  }
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

export const 基础用法 = () => ({
  template: `
    <div>
      <div style="display:flex;line-height:40px">
        <span style="margin-right:15px">选择组件类型：</span>
        <sc-select v-model="type" :res-data="typeList" @change="handleTypeChange" />
      </div>
      <br>
      <sc-date-time-picker :type="type || 'date'" v-model="value" />
    </div>
  `,
  components: { ScDateTimePicker, ScSelect },
  data() {
    return {
      typeList: [
        { label: '时间', value: 'time' }, 
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '时间范围', value: 'timerange' },
        { label: '日期范围', value: 'daterange' },
        { label: '日期时间范围', value: 'datetimerange' }
      ],
      type: 'date',
      value: ''
    }
  },
  methods: {
    handleTypeChange() {
      this.value = ''
    }
  }
})
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
      story: `通过指定type，实现不同的日期时间组件（type取值可参照参数说明），以下可通过下拉列表选择实现不同类型的日期时间组件。` 
    },
    source: {
      code: `
        <template>
          <div>
            <div>
              <span>选择组件类型</span>
              <sc-select v-model="type" :res-data="typeList" @change="handleTypeChange" />
            </div>
            
            <br>
            <sc-date-time-picker :type="type || 'date'" v-model="value" />
          </div>
        </template>

        <scirpt>
          export default {
            data() {
              typeList: [
                { label: '时间', value: 'time' }, 
                { label: '月', value: 'month' },
                { label: '日期', value: 'date' },
                { label: '日期时间', value: 'datetime' },
                { label: '时间范围', value: 'timerange' }, 
                { label: '月范围', value: 'monthrange' },
                { label: '日期范围', value: 'daterange' },
                { label: '日期时间范围', value: 'datetimerange' }
              ],
              type: 'date',
              value: ''
            },
            methods: {
              handleTypeChange() {
                this.value = ''
              }
            }
          }
        </script>
      `
    }
  }
}

export const 设置默认值 = () => ({
  template: `
    <div>
      <sc-date-time-picker type="date" v-model="date" />
      <br>
      <sc-date-time-picker type="datetimerange" v-model="daterange" />
    </div>
  `,
  components: { ScDateTimePicker },
  data() {
    return {
      date: '2022-05-01',
      daterange: ['2022-04-27', '2022-05-27']
    }
  }
})
设置默认值.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `可以指定默认值/初始值，对于单个日期/时间，指定一个表示时间/日期的字符串即可，对于范围型，初始化绑定值的字段为一个数组，即[start, end]` 
    },
    source: {
      code: `
        <template>
          <div>
            <sc-date-time-picker type="date" v-model="date" />
            <br>
            <sc-date-time-picker :type="type || 'date'" v-model="value" />
          </div>
        </template>

        <scirpt>
          export default {
            data() {
              date: '2022-05-01',
              daterange: ['2022-04-27', '2022-05-27']
            }
          }
        </script>
      `
    } 
  }
}

export const 指定选择范围 = () => ({
  template: `
    <div>
      <sc-date-time-picker type="date" :options-rang="optionsRange1" v-model="date" />
      <br>
      <sc-date-time-picker type="daterange" :options-rang="optionsRange1" v-model="daterange" />
      <br>
      <br>
      <sc-date-time-picker type="time" :options-rang="optionsRange2" v-model="time" />
      <br>
      <sc-date-time-picker type="timerange" :options-rang="optionsRange2" v-model="timerange" />
    </div>
  `,
  components: { ScDateTimePicker },
  data() {
    return {
      optionsRange1: ['2022-04-10'],
      optionsRange2: ['08:00', '20:00', '02:00'],
      date: '',
      daterange: [],
      time: '',
      timerange: []
    }
  }
})
指定选择范围.parameters = {
  previewTabs: {
    viewMode: 'docs',
    canvas: { // 隐藏canvas tab
      hidden: true,
      disable: true
    }
  },
  docs: {
    description: { 
      story: `通过指定optionsRange可以限定选择范围，以日期和日期范围、时间和时间范围为例，其他类型类似。
        对于日期型，optionsRange的值类型为[start, end],只限制start，end可以省略，但只限制end，start不能省略，用''占位；
        对于时间型，optionsRange的值类型为[start, end，stpe]，范围为00:00-23:59，根据需要设置start和end，不能省略，第三个参数step，根据需要设置，不设置，默认为'00:30'` 
    },
    source: {
      code: `
        <template>
          <div>
            <sc-date-time-picker type="date" :options-rang="optionsRange1" v-model="date" />
            <br>
            <sc-date-time-picker type="daterange" :options-rang="optionsRange1" v-model="daterange" />
            <br>
            <br>
            <sc-date-time-picker type="time" :options-rang="optionsRange2" v-model="time" />
            <br>
            <sc-date-time-picker type="timerange" :options-rang="optionsRange2" v-model="timerange" />
          </div>
        </template>

        <scirpt>
          export default {
            data() {
              optionsRange1: ['2022-04-10'],
              optionsRange2: ['08:00', '18:00', '02:00'],
              date: '',
              daterange: [],
              time: '',
              timerange: []
            }
          }
        </script>
      `
    } 
  }
}
