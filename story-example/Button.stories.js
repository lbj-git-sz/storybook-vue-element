// import MyButton from './Button.vue';
import Vue from 'vue'
import { Button } from 'element-ui'
Vue.use(Button)

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
    type: {
      control: { type: 'select' },
      defaultValue: 'primary',
      options: ['primary', 'warning', 'info'],
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Button },
  template: '<el-button v-bind="$props">click</el-button>',
});

// export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
// Primary.args = {
//   primary: true,
//   label: 'Button',
// };

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
