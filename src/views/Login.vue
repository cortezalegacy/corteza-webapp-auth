<template>
  <auth-dialog title="Login">
    <i class="img"></i>
    <form @submit.prevent="internalLogin">
      <h2>Use your email and password</h2>
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
      <router-link :to="{ name: 'signup'}">signup</router-link>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">Submit</button>

    </form>
    <div class="or">or select below:</div>
    <fieldset class="external-providers">
      <external-provider
        kind="linkedin"
        url="/auth/external/provider/provider1"
        >Linkedin</external-provider>
      <external-provider
        kind="facebook"
        url="/auth/external/provider/provider2"
        >Facebook</external-provider>
      <external-provider
        kind="gplus"
        url="/auth/external/provider/provider3"
        >Google</external-provider>
      <external-provider
              kind="github"
              url="/auth/external/provider/provider3"
      >GitHub</external-provider>
      <external-provider
              kind="openid-connect.didmos2"
              url="/auth/external/provider/provider3"
      >OpenID</external-provider>
    </fieldset>
    <hr />
    New
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
