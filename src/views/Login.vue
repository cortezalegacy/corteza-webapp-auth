<template>
  <b-card-body>
    <b-card-title>{{ $t(`view.login.title`) }}</b-card-title>
    <div v-if="externalEnabled && externalProviders" class="text-center mb-5">
      <c-external-provider v-for="p in externalProviders"
                           :key="p.handle"
                           :onExternalAuth="onExternalAuth"
                           :pKind="p.handle"
                           :pLabel="p.label"
                           :pIcon="p.icon || p.handle"></c-external-provider>
    </div>

    <b-form @submit.prevent="internalLogin" v-if="internalEnabled">
      <div class="text-danger mb-1" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>
      <b-input-group>
        <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'at']"></font-awesome-icon>
          </span>
        </b-input-group-prepend>
        <b-form-input v-model="form.email"
                      type="email"
                      :label="$t('view.login.form.email.label')"
                      :placeholder="$t('view.login.form.email.placeholder')"
                      required
                      autocomplete="email">
        </b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']"></font-awesome-icon>
          </span>
        </b-input-group-prepend>
        <b-form-input v-model="form.password"
                      type="password"
                      :label="$t('view.login.form.password.label')"
                      :placeholder="$t('view.login.form.password.placeholder')"
                      required
                      autocomplete="password"></b-form-input>
      </b-input-group>
      <small><router-link :to="{ name: 'auth:request-password-reset'}">{{ $t('link.forgotten-password-cta') }}</router-link></small>

      <b-form-group class="text-right">
        <b-button type="submit" variant="primary" :disabled="disabledSubmit">{{ $t('view.login.form.submit') }}</b-button>
      </b-form-group>

      <b-form-group v-if="internalEnabled && internalSignUpEnabled"
                    class="text-center">
        <router-link :to="{ name: 'auth:signup'}">{{ $t('link.signup-cta') }}</router-link>
      </b-form-group>
    </b-form>
    <div v-if="!(externalEnabled && externalProviders.length > 0) && !internalEnabled">
      {{ $t('auth:general.login-disabled') }}
    </div>
  </b-card-body>
</template>

<script>
const tokenRegex = /^[a-zA-Z0-9]{32}\d+$/

export default {
  name: 'Login',

  props: {
    afterLogin: { default: null },
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

    internalSignUpEnabled: {
      type: Boolean,
    },
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
    fPath () {
      return this.$route.fullPath
    },
  },

  watch: {
    fPath: {
      handler: function (newVal) {
        this.finishExternal()
      },
    },
  },

  created () {
    this.finishExternal()
  },

  methods: {
    finishExternal () {
      const token = this.$route.query.token
      if (token) {
        if (!tokenRegex.test(token)) {
          this.$router.push({ name: 'auth:login' })
        } else {
          this.exchangeToken(token)
        }
      } else if (this.$auth.is()) {
        this.$router.push({ name: 'auth:profile' })
      }
    },

    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$SystemAPI.authExchangeAuthToken({ token }).then(({ jwt, user }) => {
        return this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    internalLogin () {
      if (!this.internalEnabled) {
        return
      }

      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalLogin(this.form).then(({ jwt, user }) => {
        return this.finalize({ jwt, user })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    finalize ({ jwt, user, redirectTo = '/' }) {
      this.$auth.JWT = jwt
      this.$auth.user = user
      if (this.afterLogin) {
        this.afterLogin()
      } else {
        window.location = redirectTo
      }
    },
  },
}
</script>
