import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import Login from '../../views/Login'
import { wrapper, providers } from './setup'

Vue.prototype.$auth = { is () { return false } }

const story = storiesOf('Views|Login', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Disabled', () => ({
  components: { Login },
  i18n: i18nInit(Vue),
  template: `<login />`,
}))

story.add('Internal only', () => ({
  components: { Login },
  i18n: i18nInit(Vue),
  template: `<login :internal-enabled="true"
                    :internalSignUpEnabled="internalSignUpEnabled" />`,
  props: {
    internalSignUpEnabled: { default: boolean('Internal SignUp enabled', false) },
  },
}))

story.add('External', () => ({
  components: { Login },
  i18n: i18nInit(Vue),
  template: `<login :external-enabled="true"
                    :external-providers="externalProviders" />`,
  props: {
    externalProviders: { default: providers },
  },
}))

story.add('Full', () => ({
  components: { Login },
  i18n: i18nInit(Vue),
  template: `<login :external-enabled="true"
                    :internal-enabled="true"
                    :external-providers="externalProviders" />`,
  props: {
    externalProviders: { default: providers },
  },
}))
