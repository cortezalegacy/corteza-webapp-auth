<template>
  <div>
    <h1>{{ $t(`view.login.title`) }}</h1>
    <form @submit.prevent="internalLogin" v-if="internalEnabled">
      <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>

      <label for="email">{{ $t('view.login.form.email.label') }}</label>
      <input id="email"
             type="email"
             name="email"
             required
             autocomplete="email"
             :placeholder="$t('view.login.form.email.placeholder')"
             v-model="form.email">
      <br />

      <label for="password">{{ $t('view.login.form.password.label') }}</label>
      <input id="password"
             type="password"
             name="password"
             required
             autocomplete="password"
             :placeholder="$t('view.login.form.password.placeholder')"
             v-model="form.password">

      <router-link v-if="internalPasswordResetEnabled"
                   :to="{ name: 'auth:request-password-reset'}"
                   class="forgotten-pw">{{ $t('link.forgotten-password-cta') }}</router-link>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">{{ $t('view.login.form.submit') }}</button>
    </form>

    <div class="or" v-if="externalEnabled && externalProviders.length && internalEnabled">{{ $t('general.internal-external-separator') }}</div>

    <fieldset class="external-providers" v-if="externalEnabled && externalProviders">
      <external-provider v-for="p in externalProviders" :key="p.handle" :onExternalAuth="onExternalAuth" :pKind="p.handle" :pLabel="p.label"></external-provider>
    </fieldset>
    <div v-if="!(externalEnabled && externalProviders.length > 0) && !internalEnabled">
      {{ $t('auth:general.login-disabled') }}
    </div>
    <div class="footnote">
      <router-link v-if="internalEnabled && internalSignUpEnabled"
                   :to="{ name: 'auth:signup'}">{{ $t('link.signup-cta') }}</router-link>
    </div>
  </div>
</template>

<script>
import ExternalProvider from '../components/ExternalProvider'

const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'Login',

  components: {
    ExternalProvider,
  },
  props: {
    afterLogin: { default: null },
    onExternalAuth: { default: null },

    externalEnabled: {
      type: Boolean,
    },

    externalProviders: {
      type: Array,
    },

    internalEnabled: {
      type: Boolean,
    },

    internalPasswordResetEnabled: {
      type: Boolean,
    },

    internalSignUpEnabled: {
      type: Boolean,
    },
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  data () {
    return {
      processing: false,

      error: null,

      form: {
        email: '',
        password: '',
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
    fPath () {
      return this.$route.fullPath
    },
  },

  watch: {
    fPath: {
      handler: function (newVal) {
        this.finishExternal()
      },
    },
  },

  created () {
    this.finishExternal()
  },

  methods: {
    finishExternal () {
      const token = this.$route.query.token
      if (token) {
        if (!tokenRegex.test(token)) {
          this.$router.push({ name: 'auth:login' })
        } else {
          this.exchangeToken(token)
        }
      } else if (this.$auth.is()) {
        this.$router.push({ name: 'auth:profile' })
      }
    },

    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$SystemAPI.authExchangeAuthToken({ token }).then(({ jwt, user }) => {
        return this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    internalLogin () {
      if (!this.internalEnabled) {
        return
      }

      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalLogin(this.form).then(({ jwt, user }) => {
        return this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    finalize ({ jwt, user, redirectTo = '/' }) {
      this.$auth.JWT = jwt
      this.$auth.user = user
      if (this.afterLogin) {
        this.afterLogin()
      } else {
        window.location = redirectTo
      }
    },
  },
}
</script>
<style scoped lang="scss">
.forgotten-pw {
  display: block;
  text-align: right;
  font-size: 14px;
  color: #000;
  margin: 10px 0 20px 0;
}
</style>
