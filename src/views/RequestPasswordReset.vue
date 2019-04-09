<template>
  <auth-dialog title="Request password reset">
    <i class="img"></i>
    <form @submit.prevent="requestPasswordReset">
      <h2>use your email and password</h2>
      <label for="email">Email:</label>
      <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="email@domain.tld"
              autocomplete="email"
              v-model="form.email">

      <br/>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Submit</button>

      <div class="error" v-if="error">{{ error }}</div>
    </form>
    {{ form }}
  </auth-dialog>
</template>

<script>

export default {
  name: 'RequestPasswordReset',
  props: {
    msg: String,
  },

  data () {
    return {
      processing: false,

      error: null,

      form: {
        email: '',
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  methods: {
    requestPasswordReset () {
      this.error = null
      this.processing = true

      this.$system.authInternalRequestPasswordReset(this.form).then(r => {
        this.processing = false
      }).catch(({ message } = {}) => {
        this.error = message
        this.processing = false
      })
    },
  },
}
</script>
