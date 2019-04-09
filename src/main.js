import Vue from 'vue'
import router from './router'
import logger from './logger'
import './components'
import './plugins'

/* eslint-disable no-undef */
logger.log(
  `%cCrust CRM, version: ${CRUST_VERSION}, build time: ${CRUST_BUILD_TIME}`,
  'background-color: #1397CB; color: white; padding: 3px 10px; border: 1px solid black; font: Courier',
)

Vue.config.productionTip = false

new Vue({
  router,
  template: '<router-view/>',
}).$mount('#app')
