<template>
  <auth-dialog title="Reset your password">

    <div v-if="!user">
      <div class="error" v-if="error">{{ error }}</div>
      <div v-else>Validating password reset token...</div>
    </div>
    <form v-else @submit.prevent="changePassword">

      Set new password for {{ user.email }}

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

      <div class="error" v-if="error">{{ error }}</div>

      {{ user }}
      {{ token }}
    </form>
  </auth-dialog>
</template>

<script>

const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'Signup',
  props: {
    msg: String,
  },

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
    this.$logger.log(this.$route.query)
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
        this.processing = false
      }).catch(({ message } = {}) => {
        this.error = message
        this.processing = false
      })
    },

    changePassword () {
      this.error = null
      this.processing = true

      this.$system.authInternalConfirmEmail({ token: this.token, ...this.form }).then(r => {
        // @todo store JWT, redirect user back to wherever he came from.
        this.$logger.log(r)
      }).catch(({ message } = {}) => {
        this.error = message
        this.processing = false
      })
    },
  },
}
</script>
<style scoped>
.error {
  color: red;
}
</style>
