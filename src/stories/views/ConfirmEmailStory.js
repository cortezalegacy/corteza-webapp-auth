import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import ConfirmEmail from '../../views/ConfirmEmail'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: { email: 'user@storybook.tld' },
}

console.log(withKnobs)

const story = storiesOf('Views|ConfirmEmail', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Basic', () => ({
  components: { ConfirmEmail },
  i18n: i18nInit(),
  template: `<confirm-email :internal-enabled="true"
                    :internalSignUpEnabled="internalSignUpEnabled" />`,
  props: {
    internalSignUpEnabled: { default: boolean('Internal SignUp enabled', false) },
  },
  mounted () {
    this.$children[0].processing = false
    this.$children[0].error = null
  },
}))

story.add('Processing', () => ({
  components: { ConfirmEmail },
  i18n: i18nInit(),
  template: `<confirm-email :internal-enabled="true" />`,
  mounted () {
    this.$children[0].processing = true
    this.$children[0].error = null
  },
}))

story.add('With error', () => ({
  components: { ConfirmEmail },
  i18n: i18nInit(),
  template: `<confirm-email :internal-enabled="true" />`,
  mounted () {
    this.$children[0].error = 'Example error text'
  },
}))
