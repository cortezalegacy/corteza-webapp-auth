import Router from 'vue-router'
import routes from './views/routes'

export default new Router({
  base: '/auth',
  mode: 'history',
  routes,
})
