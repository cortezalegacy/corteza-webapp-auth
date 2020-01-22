import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(BootstrapVue)
Vue.use(Router)

Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.Auth(Vue.prototype.$SystemAPI))
Vue.use(plugins.EventBus())
Vue.use(plugins.UIHooks('auth'))
