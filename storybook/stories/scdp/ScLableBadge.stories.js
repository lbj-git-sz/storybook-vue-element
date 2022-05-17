import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import LabelBadge from '@/components/ScLabelBadge';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'scdp/LabelBadge',
  component: LabelBadge,
  decorators: [() => ({ template: '<div style="width: 300px;"><story/></div>' })],
  argTypes: {
  }
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LabelBadge },
  template: `<LabelBadge v-bind="$props" />`
});

export const 参数说明 = Template.bind({});
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
  components: { LabelBadge },
  template: `
    <div>
      <LabelBadge label="预计装货开始时间" content="预计装货开始时间为开船前7天" />
    </div>`
});
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
      story: `` 
    },
    source: {
      code: `<template>
              <LabelBadge label="预计装货开始时间" content="预计装货开始时间为开船前7天" />
            </template>`
    }
  }
}
