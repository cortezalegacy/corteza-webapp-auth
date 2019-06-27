<template>
  <div>
    <h1>{{ $t(`view.reset-password.title`) }}</h1>
    <div v-if="!user">
      <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>
      <div v-else>{{ $t('view.reset-password.validating-token') }}</div>
    </div>
    <form v-else @submit.prevent="changePassword">
      {{ $t(`view.reset-password.set-new-password`, { user }) }}

      <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>

      <label for="password">{{ $t('view.reset-password.form.new-password.label') }}</label>
      <input id="password"
             type="password"
             name="password"
             required
             :placeholder="$t('view.reset-password.form.new-password.placeholder')"
             autocomplete="password"
             v-model="form.password">
      <br />

      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">{{ $t('view.reset-password.form.reset') }}</button>

    </form>
    <div class="footnote">
      <router-link :to="{ name: 'auth:login' }">{{ $t('link.login-cta' )}}</router-link>
    </div>
  </div>
</template>

<script>

const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'ResetPassword',

  data () {
    return {
      processing: false,

      error: null,

      user: null,
      token: null,

      form: {
        password: '',
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  created () {
    const { token = null } = this.$route.query

    if (token) {
      if (!tokenRegex.test(token)) {
        this.error = this.$t('view.reset-password.error.invalid-token')
      } else {
        this.exchangeToken(token)
      }
    } else {
      this.error = this.$t('view.reset-password.error.missing-token')
    }
  },

  methods: {
    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalExchangePasswordResetToken({ token }).then(({ token, user }) => {
        this.token = token
        this.user = user
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    changePassword () {
      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalResetPassword({ token: this.token, ...this.form }).then(({ jwt, user }) => {
        this.$auth.JWT = jwt
        this.$auth.user = user
        this.$router.push({ name: 'auth:profile' })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
