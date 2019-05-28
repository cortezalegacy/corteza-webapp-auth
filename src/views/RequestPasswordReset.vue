<template>
  <div>
    <p v-if="done">Password reset request sent. Check your inbox.</p>
    <form @submit.prevent="requestPasswordReset" v-else>

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

      <br/>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Submit</button>

    </form>
    <div class="footnote">
      <router-link :to="{ name: 'login' }">Login</router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RequestPasswordReset',

  props: {
    internalPasswordResetEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      processing: false,
      done: false,

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

  created () {
    if (this.$auth.is()) {
      this.$router.push({ name: 'profile' })
    }
    if (!this.internalPasswordResetEnabled) {
      this.$router.push({ name: 'login' })
    }
  },

  methods: {
    requestPasswordReset () {
      this.error = null
      this.processing = true
      this.done = false

      this.$system.authInternalRequestPasswordReset(this.form).then(r => {
        this.done = true
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
