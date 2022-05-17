<template>
  <span class="label-slot-container">
    {{ label }}
    <el-popover
      placement="top"
      :content="content"
      :trigger="trigger"
      popper-class="label-popover"
    >
      <!-- @slot 支持通过slot传入想要展示的内容 -->
      <slot name="label-slot" />
      <!-- @slot 支持传入icon,传入通过icon样式别名,如 el-icon-question -->
      <i slot="reference" :class="['pos-icon', icon]" />
    </el-popover>
  </span>
</template>
<script>
export default {
  name: 'LabelBadge',
  props: {
    /** 点击icon后展示的隐藏内容 */
    content: {
      type: String,
      default: '隐藏的内容'
    },
    /** icon样式别名 */
    icon: {
      type: String,
      default: 'el-icon-question'
    },
    /** 触发方式 */
    trigger: {
      type: String,
      default: 'click'
    },
    /** 默认显示的内容 */
    label: {
      type: String,
      default: '默认显示的内容'
    }
  }
}
</script>
<style lang="scss" scoped>
  .label-slot-container {
    position: relative;
    .pos-icon{
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(100%, -50%);
    }
  }
</style>
<style lang="scss">
  .label-popover{
    background: #4A556B !important;
    color: #fff !important;
    .popper__arrow::after {
      border-top-color: #4A556B !important;
    }
  }
</style>
