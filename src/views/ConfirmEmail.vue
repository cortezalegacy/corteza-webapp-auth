<template>
  <div>
    <div v-if="error">
      <p class="error">Error: {{ error }}</p>
      <p>Check your email again or try to login again to receive a new token.</p>
    </div>
    <div v-else-if="processing">
      Sending confirmation token ...
    </div>
    <div v-else>
      Email confirmed, redirecting.
    </div>
    <div class="footnote" v-if="internalSignUpEnabled">
      <router-link :to="{ name: 'login'}">Login</router-link>
    </div>
  </div>
</template>

<script>

const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'ConfirmEmail',

  props: {
    internalSignUpEnabled: {
      type: Boolean,
    },
    afterConfirmEmail: { default: null },
  },

  data () {
    return {
      processing: true,
      error: null,
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  created () {
    const token = this.$route.query.token
    if (!tokenRegex.test(token)) {
      this.error = 'Invalid token'
    } else {
      this.confirmToken(token)
    }
  },

  methods: {
    confirmToken (token) {
      this.error = null
      this.processing = true

      this.$system.authInternalConfirmEmail({ token }).then(({ jwt, user }) => {
        this.$auth.JWT = jwt
        this.$auth.user = user
        if (this.afterConfirmEmail) {
          this.afterConfirmEmail()
        } else {
          window.setTimeout(() => {
            window.location = '/'
          }, 3000)
        }
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
