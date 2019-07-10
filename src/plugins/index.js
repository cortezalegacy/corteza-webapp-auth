import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import system from 'corteza-webapp-common/src/plugins/system'
import auth from 'corteza-webapp-common/src/plugins/auth'

Vue.use(BootstrapVue)
Vue.use(Router)

Vue.use(system)
Vue.use(auth)
