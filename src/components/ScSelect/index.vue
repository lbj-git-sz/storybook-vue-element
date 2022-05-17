<template>
  <div>
    <el-select 
      v-model="value" 
      :multiple="multiple"
      :filterable="filterable"
      :clearable="clearable"
      :remote="remote"
      :collapse-tags="multiple && value && value.length > 3"
      :placeholder="innerPlaceholder"
      :remote-method="filterMethodThrottle"
      :loading="loading"
      v-bind="$attrs"
      @change="change"
      @visible-change="visibleChange"
    >
      <!-- 多选 -->
      <template v-if="multiple">
        <el-checkbox-group 
          v-model="checkList" 
          @change="checkboxClick"
        >
          <el-option 
            v-for="item in options" 
            :key="item[forKey] || item[valKey]" 
            :label="item[labelKey]" 
            :value="item[valKey]"
          >
            <div @click.stop>
              <el-checkbox 
                class="select-item" 
                :label="item.value"
              >
                {{ item.label }}
              </el-checkbox>
            </div>
          </el-option>
        </el-checkbox-group>
      </template>
      <!-- 单选 -->
      <template v-else>
        <el-option
          v-for="item in options"
          :key="item[forKey] || item[valKey]"
          :label="item[labelKey]"
          :value="item[valKey]"
        />
      </template>
    </el-select>
  </div>
  
</template>

<script>
import difference from 'lodash/difference'

export default {
  name: 'ScSelect',
  model: {
    prop: 'modelVal',
    event: 'syncChange'
  },
  props: {
    /** v-model传入的value */
    modelVal: {
      type: [String, Number, Array],
      default: null
    },
    /** 请求url */
    url: {
      type: String,
      default: ''
    },
    /** 多选开关 */
    multiple: {
      type: Boolean,
      default: false
    },
    /** 模糊匹配开关，在需要使用远程模糊匹配时此prop必为true才可以 */
    filterable: {
      type: Boolean,
      default: true
    },
    /** 远程模糊匹配开关，在需要使用远程模糊匹配时此prop必为true才可以 */
    remote: {
      type: Boolean,
      default: false
    },
    /** 默认可清除 */
    clearable: {
      type: Boolean,
      default: true
    },
    /** el-option使用v-for循环的key，可不传 */
    forKey: {
      type: String,
      default: ''
    },
    /** el-option循环中作为value唯一标识的键名，绑定值为对象类型时必填 */
    valKey: {
      type: String,
      default: 'value'
    },
    /** el-option循环中作为展示内容对应的key */
    labelKey: {
      type: String,
      default: 'label'
    },
    /** 发送请求时的参数 */
    params: {
      type: [Object, Array],
      default() {
        return null
      }
    },
    /** 接口method */
    method: {
      type: String,
      default: 'post'
    },
    /** 如果传入了结果数据，就不发请求了，为了应对一个页面同时多次引入了本组件而请求地址是一样的情况 */
    resData: {
      type: Array,
      default() {
        return null
      }
    },
    /** 传入过滤条件，对象形式，可以是多个参数 */
    filterParams: {
      type: Object,
      default() {
        return {}
      }
    },
    /** placeholder */
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      options: [],
      checkList: [],
      loading: false,
      orgVal: 'origin' // 用来解决多选下拉由于集成了checkbox-group无法触发el-select封装的change事件
    }
  },
  computed: {
    value: {
      get() {
        return this.modelVal
      },
      set(val) {
        this.$emit('syncChange', val)
      }
    },
    // 防抖
    filterMethodThrottle() {
      let time = null
      return (query) => {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          this.remoteMethod(query)
          clearTimeout(time)
        }, 500)
      }
    },
    innerPlaceholder() {
      return this.placeholder || (this.remote ? '请输入关键字' : '请选择')
    }
  },
  watch: {
    url: {
      handler(newUrl) {
        if (!this.remote && newUrl?.length) this.getData(newUrl) // 如果不传入url则不发送请求
      },
      immediate: true
    },
    /** 当传参有改变时重新请求数据, 注意在调用组件时不要用:params="{ key: value }"的方式传入，这样会导致本组件关联的任何数据状态发生变化时都会触发这个watch
     最好是在调用本组件的父组件中用computed去生成一个具响应性质的变量再赋给params*/
    params: {
      handler() {
        this.getData(this.url)
      },
      deep: true
    },
    resData: {
      handler(list) {
        if (list?.length) {
          const tempList = list.filter(item => {
            return Object.entries(this.filterParams).every(el => item[el[0]] === el[1])
          })
          this.options = tempList
        } else {
          this.options = []
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        if (this.multiple) {
          if (val) {
            this.checkList = val
          } else {
            this.checkList = []
          }
          if (this.orgVal === 'origin') this.orgVal = val // 记录value初始值用来做下拉弹窗消失时
        }
      },
      immediate: true
    }
  },
  methods: {
    getData(url) {
      this.$fetch && this.$fetch[this.method](url, this.params || {}).then(res => {
        if (res.code === 0 && Array.isArray(res.data)) {
          // 过滤掉需要过滤的数据
          if (Object.keys(this.filterParams).length) {
            const tempList = res.data.filter(item => {
              return Object.entries(this.filterParams).every(el => item && item[el[0]] === el[1])
            })
            this.options = tempList
            return
          }
          this.options = res.data.filter(item => item)
        } else {
          this.options = []
        }
      })
    },
    remoteMethod(query) {
      if ((query || query === '') && this.url) {
        this.loading = true
        const params = {
          ...this.params,
          [this.paramsKey]: query
        }
        this.$fetch && this.$fetch[this.method](this.url, params || {}).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.options = res.data || []
          }
        })
      } else {
        this.options = []
      }
    },
    change(val) {
      if (this.multiple) {
        this.$emit('change', val)
        // 触发change事情之后将当前value赋给orgVal，开始下一个复制循环
        this.orgVal = this.val
      } else {
        const item = this.options.find(item => item[this.valKey] === val)
        this.$emit('change', item || {})
      }
    },
    checkboxClick(val) {
      this.value = val
    },
    visibleChange(visible) {
      // 关闭下拉弹窗的时候
      if (!visible && this.multiple) {
        if (difference(this.value, this.orgVal).length) this.change(this.value)
      }
    }
  }
}
</script>
