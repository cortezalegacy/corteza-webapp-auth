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
              placeholder="email@domain.tld"
              autocomplete="email"
              v-model="email">
      <label for="password">Password:</label>
      <input
              id="password"
              type="password"
              name="password"
              placeholder="your password"
              autocomplete="password"
              v-model="password">
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Login</button>

      <div class="error" v-if="error">{{ error }}</div>
    </form>
    <div class="or">or</div>
    <fieldset class="sso-signons">
      <div class="sso-provider-wrap google">
        <input type="radio" hidden id="google" name="target" value="google" />
        <label for="google" ><i class="icon-google"></i><span class="text">Login with <strong>Google</strong></span></label>
      </div>
      <div class="sso-provider-wrap facebook">
        <input type="radio" hidden id="facebook" name="target" value="facebook" />
        <label for="facebook"><i class="icon-facebook"></i><span class="text">Login with <strong>Facebook</strong></span></label>
      </div>
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

      email: '',
      password: '',
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
      this.processing = true
      this.$system.authInternalLogin({
        email: this.email,
        password: this.password,
      }).then(r => {
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
