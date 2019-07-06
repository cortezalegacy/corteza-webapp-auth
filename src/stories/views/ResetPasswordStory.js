import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs } from '@storybook/addon-knobs'
import ResetPassword from '../../views/ResetPassword'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|ResetPassword', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Initial', () => ({
  components: { ResetPassword },
  i18n: i18nInit(Vue),
  template: `<reset-password />`,
  mounted () {
    this.$children[0].error = null
  },
}))

story.add('Error', () => ({
  components: { ResetPassword },
  i18n: i18nInit(Vue),
  template: `<reset-password />`,
}))

story.add('Done', () => ({
  components: { ResetPassword },
  i18n: i18nInit(Vue),
  template: `<reset-password />`,
  mounted () {
    this.$children[0].email = null
    this.$children[0].user = { email: 'foo' }
  },
}))
