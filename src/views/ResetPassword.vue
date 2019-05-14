<template>
  <div>
    <div v-if="!user">
      <div class="error" v-if="error">Error: {{ error }}</div>
      <div v-else>Validating password reset token...</div>
    </div>
    <form v-else @submit.prevent="changePassword">
      Set new password for {{ user.email }}

      <div class="error" v-if="error">Error: {{ error }}</div>

      <label for="password">New password:</label>
      <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="new password"
              autocomplete="password"
              v-model="form.password">
      <br />

      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Reset</button>

    </form>
    <div class="footnote">
      <router-link :to="{ name: 'login' }">Login</router-link>
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

  created () {
    if (this.$route.query.token) {
      const token = this.$route.query.token

      if (!tokenRegex.test(token)) {
        this.error = 'Invalid token'
      } else {
        this.exchangeToken(token)
      }
    }
  },

  methods: {
    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$system.authInternalExchangePasswordResetToken({ token }).then(({ token, user }) => {
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

      this.$system.authInternalResetPassword({ token: this.token, ...this.form }).then(({ jwt, user }) => {
        this.$auth.JWT = jwt
        this.$auth.user = user
        this.$router.push({ name: 'profile' })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
