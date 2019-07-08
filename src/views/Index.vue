<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="col-md-8 col-lg-6">
      <!--<div class="error">test</div>-->
      <div class="error" v-if="error">{{ error }}</div>
      <main v-else-if="!this.processing">
        <a href="/"><div class="logo bg-white pt-5"><h1>Auth</h1></div></a>
        <section>
          <router-view v-bind="settings"/>
        </section>
      </main>
      <div class="loader" v-else>
        <div class="logo"><h1>Auth</h1></div>
      </div>
      <card-footer>
      </card-footer>
    </div>
  </div>
</template>

<script>
import CardFooter from '../components/CardFooter'

export default {
  name: 'Auth',

  components: {
    CardFooter,
  },

  data () {
    return {
      processing: false,

      error: null,

      settings: {
        internalEnabled: null,
        internalPasswordResetEnabled: null,
        internalSignUpEmailConfirmationRequired: null,
        internalSignUpEnabled: null,

        externalEnabled: null,
        externalProviders: [],
      },
    }
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  created () {
    if (!this.$SystemAPI) {
      return
    }

    this.error = null
    this.processing = true

    this.$SystemAPI.authSettings().then(ss => {
      for (var k in this.settings) {
        if (ss[k] !== undefined) {
          this.settings[k] = ss[k]
        }
      }

      // For now, sort by label just to have a stable order
      // we'll support custom sort order of external providers later.
      if (Array.isArray(this.settings.externalProviders)) {
        this.settings.externalProviders = this.settings.externalProviders.sort((a, b) => {
          return a.label.localeCompare(b.label)
        })
      }
    }).catch(({ message } = {}) => {
      if (message !== 'Network Error') {
        this.$auth.JWT = null
        this.$auth.user = null
      }

      this.error = message
    }).finally(() => {
      this.processing = false
    })
  },
}
</script>
<style lang="scss" scoped>
@keyframes flickerAnimation {
  0% { opacity: 0.6; }
  50% { opacity: 0.1; }
  100% { opacity: 0.6; }
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  img {
    align-self: center;
    opacity: 0.7;
    animation: flickerAnimation 3s infinite;
  }
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E85568;
  font-size: 24px;
  background-color: #FFFFFF;
  text-align: center;
}
</style>
