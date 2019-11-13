import Vue from 'vue'
import { createLocalVue, shallowMount as sm } from '@vue/test-utils'
import errors from 'corteza-webapp-auth/src/mixins/errors'
import sinon from 'sinon'

Vue.config.ignoredElements = [
  'font-awesome-icon',
  // Ignore all bootstrap elements
  /^b-/,
]

export const writeableWindowLocation = ({ path: value = '/' } = {}) => Object.defineProperty(window, 'location', { writable: true, value })

export const mount = (component, params = {}) => shallowMount(component, { ...params })

export const stdReject = () => sinon.stub().rejects({ message: 'err' })
export const networkReject = () => sinon.stub().rejects({ message: 'Network Error' })

export const makeToken = () => '0'.repeat(33)
export const makeJWT = () => makeToken()

export const helperMixin = {
  methods: {
    async gotoLoginFormIfAnonymous () { return undefined },
    async gotoProfileIfAuthenticated () { return undefined },
  },
}

export const shallowMount = (component, { mocks = {}, stubs = [], ...options } = {}) => {
  let localVue = createLocalVue()
  localVue.mixin(helperMixin)

  return sm(component, {
    mixins: [ errors ],
    localVue,
    stubs: ['router-view', 'router-link', 'c-external-provider', 'c-the-wrap', ...stubs],
    mocks: {
      $t: (e) => e,
      $SystemAPI: {},
      $route: { query: { fullPath: '', token: undefined } },
      ...mocks,
    },
    ...options,
  })
}

export default shallowMount
