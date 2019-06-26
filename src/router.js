import Vue from 'vue'
import Router from 'vue-router'
import routes from './views/routes'

Vue.use(Router)

export default new Router({
  base: '/auth',
  mode: 'history',
  routes,
})
