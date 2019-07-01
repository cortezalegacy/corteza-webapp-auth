import Vue from 'vue'

import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import system from 'corteza-webapp-common/src/plugins/system'
import auth from 'corteza-webapp-common/src/plugins/auth'

import i18nInit from './i18n'
import routes from './views/routes'
import App from './views/Index'

import './themes'

/* eslint-disable no-undef */
console.log(
  `%cAuth, version: ${VERSION}, build time: ${BUILD_TIME}`,
  'background-color: #1397CB; color: white; padding: 3px 10px; border: 1px solid black; font: Courier',
)

if (window.SystemAPI === undefined) {
  alert('Missing or invalid configuration. Make sure there is a public/config.js file.')
} else {
  Vue.use(BootstrapVue)
  Vue.use(system)
  Vue.use(auth)

  // Register router plugin & setup router w/ routes
  Vue.use(Router)
  const router = new Router({
    base: '/auth',
    mode: 'history',
    routes,
  })

  new Vue({
    router,
    i18n: i18nInit(Vue),
    render: h => h(App),
  }).$mount('#app')
}
