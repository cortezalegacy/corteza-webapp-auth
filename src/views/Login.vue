<template>
  <auth-dialog title="Login">
    <i class="img"></i>
    <form @submit.prevent="internalLogin">
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
      <label for="password">Password:</label>
      <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="your password"
              autocomplete="password"
              v-model="form.password">
      <br/>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Login</button>

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
    <hr />
    <router-link :to="{ name: 'signup'}">signup</router-link>
    |
    <router-link :to="{ name: 'logout'}">logout</router-link>
  </auth-dialog>
</template>

<script>
export default {
  name: 'Login',
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
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  created () {

  },

  methods: {
    internalLogin () {
      this.error = null
      this.processing = true

      this.$system.authInternalLogin(this.form).then(r => {
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
