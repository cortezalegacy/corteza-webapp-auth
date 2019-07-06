<template>
  <div>
    <h1>{{ $t('view.signup.title') }}</h1>
    <p v-if="pendingEmailConfirmation">{{ $t('view.signup.pending-email-confirmation') }}</p>
    <div v-else>
      <form @submit.prevent="internalSignup" v-if="internalSignUpEnabled">
        <label for="email">{{ $t('view.signup.form.email.label') }}</label>
        <input id="email"
               type="email"
               name="email"
               required
               autocomplete="email"
               :placeholder="$t('view.signup.form.email.placeholder')"
               v-model="form.email">
        <br />

        <label for="password">{{ $t('view.signup.form.password.label') }}</label>
        <input id="password"
               type="password"
               name="password"
               required
               autocomplete="password"
               :placeholder="$t('view.signup.form.password.placeholder')"
               v-model="form.password">
        <br />

        <label for="name">{{ $t('view.signup.form.name.label') }}</label>
        <input id="name"
               type="text"
               name="name"
               autocomplete="name"
               :placeholder="$t('view.signup.form.name.placeholder')"
               v-model="form.name">
        <br />

        <label for="handle">{{ $t('view.signup.form.handle.label') }}</label>
        <input id="handle"
               type="text"
               name="handle"
               autocomplete="handle"
               :placeholder="$t('view.signup.form.handle.placeholder')"
               v-model="form.handle">
        <br/>
        <button type="submit"
                class="login-btn"
                :disabled="disabledSubmit">{{ $t('view.signup.form.submit') }}</button>

        <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>
      </form>
      <div class="or" v-if="externalEnabled && externalProviders && internalSignUpEnabled">{{ $t('general.internal-external-separator') }}</div>
      <fieldset class="external-providers" v-if="externalEnabled && externalProviders">
        <external-provider v-for="p in externalProviders" :key="p.handle" :onExternalAuth="onExternalAuth" :pKind="p.handle" :pLabel="p.label"></external-provider>
      </fieldset>
      <div class="footnote" v-if="internalSignUpEnabled">
        <router-link v-if="internalPasswordResetEnabled"
                     :to="{ name: 'auth:request-password-reset'}"
                     class="forgotten-pw">{{ $t('link.forgotten-password-cta') }}</router-link>
        <br />
        <br />

        {{ $t('view.signup.existing-account') }}
        <router-link :to="{ name: 'auth:login'}">{{ $t('link.login') }}</router-link>
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
    onExternalAuth: { default: null },

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

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  created () {
    if (this.$auth.is()) {
      this.$router.push({ name: 'auth:profile' })
    }
  },

  methods: {
    internalSignup () {
      this.error = null
      this.processing = true
      this.pendingEmailConfirmation = false

      this.$SystemAPI.authInternalSignup(this.form).then(({ jwt, user }) => {
        this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    finalize ({ jwt, user, redirectTo = '/' }) {
      // @note can invalid jwt happen?
      if (!jwt) {
        this.pendingEmailConfirmation = true
        return
      }
      this.$auth.JWT = jwt
      this.$auth.user = user
      if (this.afterSignup) {
        this.afterSignup()
      } else {
        window.location = redirectTo
      }
    },
  },
}
</script>
