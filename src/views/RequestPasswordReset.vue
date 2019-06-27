<template>
  <div>
    <h1>{{ $t(`view.request-password-reset.title`) }}</h1>
    <p v-if="done">{{ $t('view.request-password-reset.password-request-sent') }}</p>
    <form @submit.prevent="requestPasswordReset" v-else>

      <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>

      <label for="email">{{ $t('view.request-password-reset.form.email.label') }}</label>
      <input
              id="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              :placeholder="$t('view.request-password-reset.form.email.placeholder')"
              v-model="form.email">

      <br/>
      <button type="submit"
              class="login-btn"
              :disabled="disabledSubmit">{{ $t('view.request-password-reset.form.send') }}</button>

    </form>
    <div class="footnote">
      <router-link :to="{ name: 'auth:login' }">{{ $t('link.login-cta' )}}</router-link>
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

  i18nOptions: {
    namespaces: [ 'auth' ],
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
      this.$router.push({ name: 'auth:profile' })
      return
    }
    if (!this.internalPasswordResetEnabled) {
      this.$router.push({ name: 'auth:login' })
    }
  },

  methods: {
    requestPasswordReset () {
      this.error = null
      this.processing = true
      this.done = false

      this.$SystemAPI.authInternalRequestPasswordReset(this.form).then(r => {
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
