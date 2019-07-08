import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Index from '../../views/Index'

import '../../themes'
import '../../ui'
import i18nInit from '../../i18n'

Vue.use(BootstrapVue)

export const wrapper = () => {
  // Wrap everything
  return {
    i18n: i18nInit(Vue),
    components: { Index },
    template: `  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="col-md-8 col-lg-6">
      <main>
        <a href="/"><div class="logo bg-white pt-5"><h1>Auth</h1></div></a>
        <section>
          <story/>
        </section>
      </main>
    </div>
  </div>`,
  }
}

export const providers = [
  { handle: 'google', label: 'Google' },
  { handle: 'facebook', label: 'Facebook' },
  { handle: 'github', label: 'GitHub' },
  { handle: 'oidc', label: 'OpenID-Connect' },
  { handle: 'linkedin', label: 'LinkedIn' },
]
