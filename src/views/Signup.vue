<template>
  <div>
    <p v-if="pendingEmailConfirmation">Email confirmation link sent. Check your inbox.</p>
    <div v-else>
      <form @submit.prevent="internalSignup" v-if="internalSignUpEnabled">
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
                placeholder="Your password"
                autocomplete="password"
                v-model="form.password">
        <br />

        <label for="name">Full name:</label>
        <input
                id="name"
                type="text"
                name="name"
                placeholder="Your full name"
                autocomplete="name"
                v-model="form.name">
        <br />

        <label for="handle">Name, nickname, handle:</label>
        <input
                id="handle"
                type="text"
                name="handle"
                placeholder="Name"
                autocomplete="handle"
                v-model="form.handle">

        <br/>
        <button type="submit"
                class="login-btn"
                :disabled="disabledSubmit">Submit</button>

        <div class="error" v-if="error">Error: {{ error }}</div>
      </form>
      <div class="or" v-if="externalEnabled && externalProviders && internalSignUpEnabled">or select below:</div>
      <fieldset class="external-providers" v-if="externalEnabled && externalProviders">
        <external-provider v-for="p in externalProviders" :key="p.handle" :pKind="p.handle" :pLabel="p.label"></external-provider>
      </fieldset>
      <div class="footnote" v-if="internalSignUpEnabled">
        <router-link v-if="internalPasswordResetEnabled"
                     :to="{ name: 'request-password-reset'}"
                     class="forgotten-pw">Forgotten password?</router-link>
        <br />
        <br />

        Already have an account?
        <router-link :to="{ name: 'login'}">Login here</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ExternalProvider from '../components/ExternalProvider'

export default {
  name: 'Signup',

  components: {
    ExternalProvider,
  },

  props: {
    afterSignup: { default: null },

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

      // This will be set to true when backend has email confirmation enabled
      pendingEmailConfirmation: false,

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

  created () {
    if (this.$auth.is()) {
      this.$router.push({ name: 'profile' })
    }
  },

  methods: {
    internalSignup () {
      this.error = null
      this.processing = true
      this.pendingEmailConfirmation = false

      this.$system.authInternalSignup(this.form).then(({ jwt, user }) => {
        this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    finalize ({ jwt, user, redirectTo = '/' }) {
      if (jwt) {
        this.$auth.JWT = jwt
        this.$auth.user = user
        if (this.afterSignup) {
          this.afterSignup()
        } else {
          window.location = redirectTo
        }
      } else {
        this.pendingEmailConfirmation = true
      }
    },
  },
}
</script>
