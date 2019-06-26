import Vue from 'vue'
import router from './router'
import App from './views/Index'
import './plugins'
import '@/assets/sass/index.scss'

/* eslint-disable no-undef */
console.log(
  `%cAuth, version: ${VERSION}, build time: ${BUILD_TIME}`,
  'background-color: #1397CB; color: white; padding: 3px 10px; border: 1px solid black; font: Courier',
)

Vue.config.productionTip = false

if (window.SystemAPI === undefined) {
  alert('Missing or invalid configuration. Make sure there is a public/config.js file.')
} else {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app')
}
