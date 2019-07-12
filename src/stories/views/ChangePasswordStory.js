import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs } from '@storybook/addon-knobs'
import ChangePassword from '../../views/ChangePassword'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|ChangePassword', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Basic', () => ({
  components: { ChangePassword },
  i18n: i18nInit(),
  template: `<change-password :internal-enabled="true" />`,
}))

story.add('With error', () => ({
  components: { ChangePassword },
  i18n: i18nInit(),
  template: `<change-password :internal-enabled="true" />`,
  mounted () {
    this.$children[0].error = 'Example error text'
  },
}))

story.add('After password change', () => ({
  components: { ChangePassword },
  i18n: i18nInit(),
  template: `<change-password :internal-enabled="true" />`,
  mounted () {
    this.$children[0].passwordChanged = true
  },
}))
