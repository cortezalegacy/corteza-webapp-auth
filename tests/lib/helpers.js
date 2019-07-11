import Vue from 'vue'

import { shallowMount } from '@vue/test-utils'

const writeableWindowLocation = ({ path: value = '/' } = {}) => Object.defineProperty(window, 'location', { writable: true, value })

const mount = (component, params = {}) => shallowMount(component, { ...params })

Vue.config.ignoredElements = [
  'font-awesome-icon',
  // Ignore all bootstrap elements
  /^b-/,
]

export { writeableWindowLocation, mount }
