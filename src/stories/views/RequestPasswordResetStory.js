import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import RequestPasswordReset from '../../views/RequestPasswordReset'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|RequestPasswordReset', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Basic', () => ({
  components: { RequestPasswordReset },
  i18n: i18nInit(),
  template: `<request-password-reset :internal-enabled="true"
                    :internalPasswordResetEnabled="internalPasswordResetEnabled" />`,
  props: {
    internalPasswordResetEnabled: { default: boolean('Password reset enabled', false) },
  },
}))

story.add('With error', () => ({
  components: { RequestPasswordReset },
  i18n: i18nInit(),
  template: `<request-password-reset :internal-enabled="true" />`,
  mounted () {
    this.$children[0].error = 'Example error text'
  },
}))

story.add('Done', () => ({
  components: { RequestPasswordReset },
  i18n: i18nInit(),
  template: `<request-password-reset :internal-enabled="true" />`,
  mounted () {
    this.$children[0].done = true
  },
}))
