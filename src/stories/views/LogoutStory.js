import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs } from '@storybook/addon-knobs'
import Logout from '../../views/Logout'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|Logout', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Basic', () => ({
  components: { Logout },
  i18n: i18nInit(Vue),
  template: `<logout />`,
}))

story.add('With error', () => ({
  components: { Logout },
  i18n: i18nInit(Vue),
  template: `<logout />`,
  mounted () {
    this.$children[0].error = 'Example error text'
  },
}))
