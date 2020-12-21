import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import VueProgressBar from 'vue-progressbar'
import vars from '../themes/corteza-base/variables.scss'

import { plugins } from '@cortezaproject/corteza-vue'

import pairs from './eventbus-pairs'

Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(VueProgressBar, {
  color: vars.primary,
  failedColor: vars.danger,
  thickness: '7px',
})

Vue.use(plugins.CortezaAPI('system'))

const notProduction = (process.env.NODE_ENV !== 'production')

Vue.use(plugins.EventBus(), {
  strict: notProduction,
  verbose: notProduction,
  pairs,
})

Vue.use(plugins.UIHooks(), {
  app: 'compose',
  verbose: notProduction,
})

Vue.use(plugins.Auth(), { api: Vue.prototype.$SystemAPI })
Vue.use(plugins.UIHooks(), { app: 'auth' })
