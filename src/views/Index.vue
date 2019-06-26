<template>
  <div>
    <div class="error" v-if="error">{{ error }}</div>

    <main v-else-if="!this.processing">
      <a href="/"><img alt="Corteza logo" class="logo" src="../assets/corteza-logo-with-tagline.png"></a>
      <section>
        <h1>{{ t(`dialog.${$route.name}.title`) }}</h1>
        <router-view v-bind="settings"/>
      </section>
    </main>

    <div class="loader" v-else>
      <img :src="logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',

  data () {
    return {
      logo: require('../assets/corteza-logo-with-tagline.png'),

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

  computed: {
    t () {
      // @todo temporary, move to file
      return (k) => ({
        'dialog.change-password.title': 'Change your password',
        'dialog.confirm-email.title': 'Email confirmation',
        'dialog.login.title': 'Login',
        'dialog.logout.title': 'Logout',
        'dialog.request-password-reset.title': 'Request password reset link',
        'dialog.reset-password.title': 'Reset your password',
        'dialog.signup.title': 'Sign up',
        'dialog.profile.title': 'Your profile',
      }[k] || k)
    },
  },

  created () {
    this.loadSettings()
  },

  methods: {
    loadSettings () {
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
  height: 20vh;
  top: 40vh;
  text-align: center;
}

main {
  h1 {
    margin: 0;
    padding: 0 0 20px 0;
    font-size: 18px;
  }

  position: relative;
  max-width: 320px;

  section {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  }

  img.logo {
    max-width: 80%;
    display: block;
    margin: 0 auto;
  }
}
</style>
