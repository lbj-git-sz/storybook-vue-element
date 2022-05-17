<script>
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export default {
  name: 'ScDateTimePicker',
  components: {
    TimePicker: {
      render(h) {
        return (
          <el-time-select
            vModel={ this.$parent.modelValue }
            value-format={ this.$parent.valueFormat }
            placeholder={ this.$parent.placeholder }
            picker-options={ this.$parent.getPickerOptions() }
            { ...{ attrs: this.$parent.$attrs } }
            { ...{ on: this.$parent.$listeners } }
          />
        )
      }
    },
    DatePicker: {
      render(h) {
        return (
          <el-date-picker
            vModel={ this.$parent.modelValue }
            type={ this.$parent.type }
            value-format={ this.$parent.valueFormat }
            placeholder={ this.$parent.placeholder }
            picker-options={ this.$parent.getPickerOptions() }
            { ...{ attrs: this.$parent.$attrs } }
            { ...{ on: this.$parent.$listeners } }
          />
        )
      }
    },
    TimeRangePicker: {
      render(h) {
        return (
          <div 
            class={ ['sc-datetime__rang', { 'is-active': this.$parent.startActive || this.$parent.endActive }] }
          >
            <el-time-select
              vModel={ this.$parent.startTime }
              class='sc-datetime__prefix'
              placeholder={ this.$parent.startPlaceholder }
              picker-options={ this.$parent.getPickerOptions('start') }
              { ...{ attrs: this.$parent.$attrs } }
              { ...{ on: this.$parent.$listeners } }
              vOn:focus={ this.$parent.handleFoucs.bind(this, 'start') }
              vOn:blur={ this.$parent.handleBlur.bind(this, 'start') }
            />
            <span>{ this.$parent.rangeSeparator }</span>
            <el-time-select
              vModel={ this.$parent.endTime }
              class='sc-datetime__prefix'
              placeholder={ this.$parent.endPlaceholder }
              picker-options={ this.$parent.getPickerOptions('end') }
              { ...{ attrs: this.$parent.$attrs } }
              { ...{ on: this.$parent.$listeners } }
              vOn:focus={ this.$parent.handleFoucs.bind(this, 'end') }
              vOn:blur={ this.$parent.handleBlur.bind(this, 'end') }
            />
            <span 
              class={ ['el-icon-circle-close', { 'is-hide': !(this.$parent.startTime || this.$parent.endTime) }] }
              vOn:click={ this.$parent.clearDate }
            >
            </span>
          </div>
        )
      }
    },
    DateRangePicker: {
      render(h) {
        return (
          <div 
            class={ ['sc-datetime__rang', { 'is-active': this.$parent.startActive || this.$parent.endActive }] }
          >
            <el-date-picker
              vModel={ this.$parent.startTime }
              class='sc-datetime__prefix'
              type={ this.$parent.typeFormat }
              value-format={ this.$parent.valueFormat }
              placeholder={ this.$parent.startPlaceholder }
              picker-options={ this.$parent.getPickerOptions('start') }
              { ...{ attrs: this.$parent.$attrs } }
              { ...{ on: this.$parent.$listeners } }
              vOn:focus={ this.$parent.handleFoucs.bind(this, 'start') }
              vOn:blur={ this.$parent.handleBlur.bind(this, 'start') }
              vOn:change={ this.$parent.handleChange.bind(this, 'start') }
            />
            <span>{ this.$parent.rangeSeparator }</span>
            <el-date-picker
              vModel={ this.$parent.endTime }
              class='sc-datetime__prefix'
              type={ this.$parent.typeFormat }
              value-format={ this.$parent.valueFormat }
              placeholder={ this.$parent.endPlaceholder }
              picker-options={ this.$parent.getPickerOptions('end') }
              prefix-icon={ '' }
              { ...{ attrs: this.$parent.$attrs } }
              { ...{ on: this.$parent.$listeners } }
              vOn:focus={ this.$parent.handleFoucs.bind(this, 'end') }
              vOn:blur={ this.$parent.handleBlur.bind(this, 'end') }
              vOn:change={ this.$parent.handleChange.bind(this, 'end') }
            />
            <span 
              class={ ['el-icon-circle-close', { 'is-hide': !(this.$parent.startTime || this.$parent.endTime) }] }
              vOn:click={ this.$parent.clearDate }
            >
            </span>
          </div>
        )
      }
    }
  },
  model: {
    prop: 'value',
    event: 'valChange'
  },
  props: {
    /** 类型： 默认为日期类型，可选time、date、datetime、month、timerange、daterange、datetimerange、monthrange */
    type: { 
      type: String, 
      default: 'date' 
    },
    /** 时间：可是tring或Array类型，单独的时间/日期接受一个String值，范围时间/日期接受一个Array，即[startTime, endTime] */
    value: { 
      type: [String, Array, null], 
      default: '',
      required: true
    },
    /** 可选的日期范围：包含日期的范围选择接受2个元素值，即[start, end]，对于时间范围，可接受3个元素值，即[start, end，step]，其中，start--开始日期/日期，end--结束日期/时间，step--时间间隔，默认'00:30' */
    optionsRang: {
      type: Array,
      default: null
    },
    /** 范围选择分隔符：默认为'-' */
    rangeSeparator: { 
      type: String, 
      default: '-' 
    },
    /** 占位符 */
    placeholder: { 
      type: String, 
      default: '请选择' 
    },
    /** 范围选择，开始选择框占位符 */
    startPlaceholder: { 
      type: String, 
      default: '开始时间'
    },
    /** 范围选择，结束选择框占位符 */
    endPlaceholder: { 
      type: String, 
      default: '结束时间'
    }
  },
  data() {
    return {
      startActive: false,
      endActive: false
    }
  },
  computed: {
    /** 接收value，解决子组件不能直接更改props传来的属性值的问题 */
    modelValue: {
      get() {
        if (this.value && this.type === 'datetime') {
          return dayjs(this.value).format('YYYY-MM-DD HH:mm:ss')
        }
        return this.value
      },
      set(val) {
        if (!val) {
          if (this.type.includes('rang')) {
            this.$emit('valChange', [])
          } else {
            this.$emit('valChange', '')
          }
        } else {
          this.$emit('valChange', val)
        }
      }
    },
    /** 范围选择，开始日期/时间 */
    startTime: {
      get() {
        if (this.value && this.value[0]) {
          if (this.type === 'datetimerange') {
            return dayjs(this.value[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          return this.value[0]
        }
        return ''
      },
      set(val) {
        this.$emit('valChange', [val || '', this.endTime])
      }
    },
    /** 范围选择，结束日期/时间 */
    endTime: {
      get() {
        if (this.value && this.value[1]) {
          if (this.type === 'datetimerange') {
            return dayjs(this.value[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          return this.value[1]
        }
        return ''
      },
      set(val) {
        this.$emit('valChange', [this.startTime, val || ''])
      }
    },
    /** 包含日期的取值格式，要与type配套使用 */
    valueFormat() {
      let res
      switch (this.type) {
        case 'date':
        case 'daterange':
          res = 'yyyy-MM-dd'
          break
        case 'datetime':
        case 'datetimerange':
          res = 'yyyy-MM-dd HH:mm:ss'
          break
        case 'month':
        case 'monthrange':
          res = 'yyyy-MM'
          break
        default:
          res = 'yyyy-MM-dd'
          break
      }
      return res
    },
    /** 日期格式，对于range类型，处理type */
    typeFormat() {
      let res
      switch (this.type) {
        case 'date':
        case 'daterange':
          res = 'date'
          break
        case 'datetime':
        case 'datetimerange':
          res = 'datetime'
          break
        case 'month':
        case 'monthrange':
          res = 'month'
          break
        default:
          res = 'date'
          break
      }
      return res
    }
  },
  methods: {
    /** 限制选择范围 */
    getPickerOptions(flag) {
      const _this = this
      let start = ''
      let end = ''
      let step = '00:30'
      let po = {}

      if (_this.optionsRang?.length > 0) {
        start = _this.optionsRang[0]
        end = _this.optionsRang[1]
      }
      if (_this.optionsRang?.length === 3) {
        step = _this.optionsRang[2]
      }
      
      if (_this.type === 'time' || _this.type === 'timerange') {
        if (!start) {
          start = '00:00'
        }
        if (!end) {
          end = '23:30'
        }
        // 时间，限制选择范围
        po = {
          start: start,
          end: end,
          step: step
        }
        // 时间范围选择，限定结束时间不能早于开始时间，开始时间不能晚于结束时间
        if (_this.type === 'timerange') {
          flag === 'start' && (po.maxTime = _this.endTime)
          flag === 'end' && (po.minTime = _this.startTime)
        }
      } else if (_this.type.includes('range')) {
        // 日期/日期时间范围，限制选择范围
        po = {
          disabledDate(time) {
            if (start && end) {
              if (_this.startTime && flag === 'end') {
                return !dayjs(time).isBetween(dayjs(_this.startTime).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD'), null, '[]')
              }
              if (_this.endTime && flag === 'start') {
                return !dayjs(time).isBetween(dayjs(start).format('YYYY-MM-DD'), dayjs(_this.endTime).format('YYYY-MM-DD'), null, '[]')
              } 
              return !dayjs(time).isBetween(dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD'), null, '[]')
            } else {
              if (_this.startTime && flag === 'end') {
                if (end) {
                  return !dayjs(time).isBetween(dayjs(_this.startTime).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD'), null, '[]')
                }
                return dayjs(time).isBefore(dayjs(_this.startTime).format('YYYY-MM-DD'))
              }
              if (_this.endTime && flag === 'start') {
                if (start) {
                  return !dayjs(time).isBetween(dayjs(start).format('YYYY-MM-DD'), dayjs(_this.endTime).format('YYYY-MM-DD'), null, '[]')
                }
                return dayjs(time).isAfter(dayjs(_this.endTime).format('YYYY-MM-DD'))
              }
              if (start) {
                return dayjs(time).isBefore(dayjs(start).format('YYYY-MM-DD'))
              }
              if (end) {
                return dayjs(time).isAfter(dayjs(end).format('YYYY-MM-DD'))
              }
            }
          }
        }
      } else {
        // 日期/日期时间，限制选择范围
        po = {
          disabledDate(time) {
            if (start && end) {
              return !dayjs(time).isBetween(dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD'), null, '[]')
            } else {
              if (start) {
                return dayjs(time).isBefore(dayjs(start).format('YYYY-MM-DD'))
              }
              if (end) {
                return dayjs(time).isAfter(dayjs(end).format('YYYY-MM-DD'))
              }
            }
          }
        }
      }
      return po
    },
    clearDate() {
      this.$emit('valChange', [])
      this.$emit('change', [])
    },
    handleFoucs(flag) {
      if (flag === 'start') {
        this.startActive = true
      }
      if (flag === 'end') {
        this.endActive = true
      }
    },
    handleBlur(flag) {
      if (flag === 'start') {
        this.startActive = false
      }
      if (flag === 'end') {
        this.endActive = false
      }
    },
    handleChange(flag) {
      if (this.type === 'datetimerange') {
        if (flag === 'start' && this.endTime && dayjs(this.startTime).isAfter(this.endTime)) {
          this.$emit('valChange', [this.startTime, this.startTime])
          this.$emit('change', [this.startTime, this.startTime])
          return
        }
        if (flag === 'end' && this.startTime && dayjs(this.endTime).isBefore(this.startTime)) {
          this.$emit('valChange', [this.endTime, this.endTime])
          this.$emit('change', [this.endTime, this.endTime])
          return
        }
      } else if (this.type.includes('range')) {
        this.$emit('change', [this.startTime, this.endTime])
      } else {
        this.$emit('change', this.modelValue)
      }
    }
  },
  render(h) {
    const template = <div class='sc-datetime'></div>
    const TEMPLATE_MAP = {
      timePicker: <time-picker></time-picker>,
      datePicker: <date-picker></date-picker>,
      timeRangePicker: <time-range-picker></time-range-picker>,
      dateRangePicker: <date-range-picker></date-range-picker>
    }
    let picker = ''
    switch (this.type) {
      case 'time':
        picker = 'timePicker'
        break
      case 'timerange':
        picker = 'timeRangePicker'
        break
      case 'monthrange':
      case 'daterange':
      case 'datetimerange':
        picker = 'dateRangePicker'
        break
      default:
        picker = 'datePicker'
        break
    }
    template.children = template.children || []
    template.children.push(TEMPLATE_MAP[picker])
    return template
  }
}
</script>
