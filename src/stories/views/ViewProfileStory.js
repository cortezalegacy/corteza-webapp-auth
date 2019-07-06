import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import i18nInit from '../../i18n'
import StoryRouter from 'storybook-vue-router'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import ViewProfile from '../../views/ViewProfile'
import { wrapper } from './setup'

Vue.prototype.$auth = {
  is () { return true },
  user: {},
}

console.log(withKnobs)

const story = storiesOf('Views|ViewProfile', module)
  .addDecorator(StoryRouter({}, {}))
  .addDecorator(withKnobs)
  .addDecorator(wrapper)

story.add('Full', () => ({
  components: { ViewProfile },
  i18n: i18nInit(Vue),
  template: `<view-profile :internal-enabled="internalEnabled" :user="user" />`,
  props: {
    internalEnabled: { default: boolean('Internal login enabled', false) },
    user: { default: {
      email: 'email@example.tld',
      name: 'Joe Example',
      handle: 'joEe',
    } },
  },
}))

story.add('Just email', () => ({
  components: { ViewProfile },
  i18n: i18nInit(Vue),
  template: `<view-profile :internal-enabled="internalEnabled" :user="user" />`,
  props: {
    internalEnabled: { default: boolean('Internal login enabled', false) },
    user: { default: { email: 'email@example.tld' } },
  },
}))
