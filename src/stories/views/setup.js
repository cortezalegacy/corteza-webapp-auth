import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import '../../themes'
import '../../components'

Vue.use(BootstrapVue)

Vue.mixin({
  methods: {
    async gotoProfileIfAuthenticated () {
      return Promise
    },

    async gotoLoginFormIfAnonymous () {
      return Promise
    },
  },
})

export const wrapper = () => {
  // Wrap everything
  return {
    template: `<c-the-wrap><story /></c-the-wrap>`,
  }
}

export const providers = [
  { handle: 'google', label: 'Google', icon: 'google' },
  { handle: 'facebook', label: 'Facebook' },
  { handle: 'github', label: 'GitHub' },
  { handle: 'oidc', label: 'OIDC', icon: 'openid' },
  { handle: 'linkedin', label: 'LinkedIn' },
]
