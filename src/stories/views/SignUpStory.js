import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs } from '@storybook/addon-knobs'
import Signup from '../../views/Signup'
import { wrapper, providers } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|Signup', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Basic', () => ({
  components: { Signup },
  i18n: i18nInit(Vue),
  template: `<signup :internalSignUpEnabled="true" />`,
}))

story.add('With external providers', () => ({
  components: { Signup },
  i18n: i18nInit(Vue),
  template: `<signup :internalSignUpEnabled="true"
                    :external-enabled="true"
                    :external-providers="externalProviders" />`,
  props: {
    externalProviders: { default: providers },
  },
}))

story.add('With error', () => ({
  components: { Signup },
  i18n: i18nInit(Vue),
  template: `<signup :internalSignUpEnabled="true" />`,
  mounted () {
    this.$children[0].error = 'Example error text'
  },
}))

story.add('Pending email confirmation', () => ({
  components: { Signup },
  i18n: i18nInit(Vue),
  template: `<signup :internalSignUpEnabled="true" />`,
  mounted () {
    this.$children[0].pendingEmailConfirmation = true
  },
}))
