<template>
  <auth-dialog title="Email confirmation">
    <div v-if="error">
      {{ error }}
      <br />
      <br />
      <br />
      Check your email again or try to login again to receive a new token.
      <br />
      <br />
      <router-link :to="{ name: 'login' }">Login</router-link>
    </div>
    <div v-else-if="processing">
      Sending confirmation token ...
    </div>
  </auth-dialog>
</template>

<script>

const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'ConfirmEmail',
  props: {
    msg: String,
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

      this.$system.authInternalConfirmEmail({ token }).then(r => {
        // @todo store JWT, redirect user back to wherever he came from.
        this.$logger.log(r)
        this.processing = false
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
