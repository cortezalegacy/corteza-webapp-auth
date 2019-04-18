<template>
  <auth-dialog title="Login">
    <form @submit.prevent="internalLogin" v-if="internalEnabled">
      <div class="error" v-if="error">Error: {{ error }}</div>

      <label for="email">Email:</label>
      <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="email@domain.tld"
              autocomplete="email"
              v-model="form.email">
      <label for="password">Password:</label>
      <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Your password"
              autocomplete="password"
              v-model="form.password">
      <router-link v-if="internalPasswordResetEnabled"
                   :to="{ name: 'request-password-reset'}"
                   class="forgotten-pw">Forgotten password?</router-link>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Submit</button>
    </form>

    <div class="or" v-if="externalEnabled && externalProviders && internalEnabled">or select below:</div>

    <fieldset class="external-providers" v-if="externalEnabled && externalProviders">
      <external-provider v-for="p in externalProviders" :key="p.handle" :kind="p.handle" :label="p.label"></external-provider>
    </fieldset>
    <div class="footnote">
      <router-link v-if="internalEnabled && internalSignUpEnabled"
                   :to="{ name: 'signup'}">Create new account</router-link>
    </div>
  </auth-dialog>
</template>

<script>
const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'Login',
  props: {
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
  },

  created () {
    const token = this.$route.query.token
    if (token) {
      if (!tokenRegex.test(token)) {
        this.$router.push({ name: 'login' })
      } else {
        this.exchangeToken(token)
      }
    } else if (this.$auth.is()) {
      this.$router.push({ name: 'profile' })
    }
  },

  methods: {

    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$system.authExchangeAuthToken({ token }).then(({ jwt, user }) => {
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

      this.$system.authInternalLogin(this.form).then(({ jwt, user }) => {
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
      window.location = redirectTo
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
