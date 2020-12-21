import Vue from 'vue'

import './config-check'
import './console-splash'

import './plugins'
import './mixins'
import './components'

import i18n from './i18n'
import store from './store'
import router from './router'
import App from './views/App'

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'compose',
    // template: '<div id="auth" class="container h-100"><router-view class="view" /></div>',
    render: h => h(App),

    router,
    store,
    i18n: i18n(),

    mounted () {
      this.$Progress.finish()
    },

    created () {
      if (this.$auth.is()) {
        // Setup the progress bar
        this.$Progress.start()
        this.$router.beforeEach((to, from, next) => {
          this.$Progress.start()
          next()
        })
        this.$router.afterEach((to, from) => {
          this.$Progress.finish()
        })
      }
    },

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
