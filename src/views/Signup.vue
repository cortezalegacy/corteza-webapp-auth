<template>
  <auth-dialog title="Login">
    <i class="img"></i>
    <form @submit.prevent="internalSignup">
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
      <br />

      <label for="password">Password:</label>
      <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="your password"
              autocomplete="password"
              v-model="form.password">
      <br />

      <label for="name">Name:</label>
      <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              autocomplete="name"
              v-model="form.name">
      <br />

      <label for="handle">Nickname/handle:</label>
      <input
              id="handle"
              type="text"
              name="handle"
              placeholder="shortname"
              autocomplete="handle"
              v-model="form.handle">

      <br/>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Signup</button>

      <div class="error" v-if="error">{{ error }}</div>
    </form>
    <div class="or">or</div>
    <fieldset class="external-providers">
      <external-provider
              kind="provider1"
              url="/auth/external/provider/provider1"
      >provider 1</external-provider>
      <external-provider
              kind="provider2"
              url="/auth/external/provider/provider2"
      >provider 2</external-provider>
      <external-provider
              kind="provider3"
              url="/auth/external/provider/provider3"
      >provider 3</external-provider>
    </fieldset>
    {{ form }}
    <hr />
    <router-link :to="{ name: 'signup'}">signup</router-link>
    |
    <router-link :to="{ name: 'logout'}">logout</router-link>
  </auth-dialog>
</template>

<script>
export default {
  name: 'Signup',
  props: {
    msg: String,
  },

  data () {
    return {
      processing: false,

      error: null,

      form: {
        email: '',
        password: '',
        name: '',
        handle: '',
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  methods: {
    internalSignup () {
      this.error = null
      this.processing = true

      this.$system.authInternalSignup(this.form).then(r => {
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
