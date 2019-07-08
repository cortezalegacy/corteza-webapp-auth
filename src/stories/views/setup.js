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
    template: `    <div class="container" style="height:100vh">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-md-8 col-lg-6">
      <main>
        <a href="/"><div class="logo bg-white pt-5"><h1>Auth</h1></div></a>
        <section>
          <story/>
        </section>
      </main>
      <div slot="footer" class="text-right card-footer bg-light border-top-0">
          <small class="text-muted"><a href="https://cortezaproject.org/" target="_blank">cortezaproject.org</a></small>
          <span>  |  </span>
          <small class="text-muted"><a href="https://github.com/cortezaproject/" target="_blank">Github</a></small>
      </div>
    </div>
    </div>
  </div>`,
  }
}

export const providers = [
  { handle: 'google', label: 'Google' },
  { handle: 'facebook', label: 'Facebook' },
  { handle: 'github', label: 'GitHub' },
  { handle: 'oidc', label: 'OIDC', icon: 'openid' },
  { handle: 'linkedin', label: 'LinkedIn' },
]
