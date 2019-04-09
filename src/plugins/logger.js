import logger from '@/logger'

export default {
  install (Vue) {
    Vue.prototype.$logger = logger
  },
}
