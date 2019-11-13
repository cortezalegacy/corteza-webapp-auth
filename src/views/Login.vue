<template>
  <b-card-body>
    <b-card-title>{{ $t(`view.login.title`) }}</b-card-title>
    <div class="d-flex w-100 justify-content-center">
      <div
        v-if="externalEnabled && externalProviders && externalProviders.length"
        class="d-flex mb-5 external-providers"
      >
        <c-external-provider
          v-for="p in externalProviders"
          :key="p.handle"
          class="flex-reset"
          :on-external-auth="onExternalAuth"
          :p-kind="p.handle"
          :p-label="p.label"
          :p-icon="p.icon || p.handle"
        />
      </div>
    </div>

    <b-form
      v-if="internalEnabled"
      class="login-form"
      @submit.prevent="internalLogin"
    >
      <div
        v-if="error"
        class="text-danger mb-1 error"
      >
        {{ $t('general.error-tpl', { error: parseError(error) }) }}
      </div>
      <b-input-group>
        <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'at']" />
          </span>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.email"
          type="email"
          :label="$t('view.login.form.email.label')"
          :placeholder="$t('view.login.form.email.placeholder')"
          required
          autocomplete="email"
        />
      </b-input-group>

      <b-input-group class="mt-2">
        <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']" />
          </span>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.password"
          type="password"
          :label="$t('view.login.form.password.label')"
          :placeholder="$t('view.login.form.password.placeholder')"
          required
          autocomplete="password"
        />
      </b-input-group>

      <template v-if="internalPasswordResetEnabled">
        <small>
          <router-link :to="{ name: 'auth:request-password-reset'}">{{ $t('link.forgotten-password-cta') }}</router-link>
        </small>
      </template>

      <b-form-group class="text-right">
        <b-button
          type="submit"
          variant="primary"
          :disabled="processing"
        >
          {{ $t('view.login.form.submit') }}
        </b-button>
      </b-form-group>

      <b-form-group
        v-if="internalEnabled && internalSignUpEnabled"
        class="text-center"
      >
        <router-link :to="{ name: 'auth:signup'}">
          {{ $t('link.signup-cta') }}
        </router-link>
      </b-form-group>
    </b-form>
    <div v-if="!(externalEnabled && externalProviders && externalProviders.length > 0) && !internalEnabled">
      {{ $t('auth:general.login-disabled') }}
    </div>
  </b-card-body>
</template>

<script>
import ExternalProvider from 'corteza-webapp-auth/src/components/ExternalProvider'
import { tokenRegex } from 'corteza-webapp-auth/src/lib/common'

export default {
  name: 'Login',

  components: {
    'c-external-provider': ExternalProvider,
  },

  props: {
    afterLogin: {
      type: Function,
      default: null,
    },
    onExternalAuth: {
      type: Function,
      default: null,
    },

    internalPasswordResetEnabled: {
      type: Boolean,
    },

    externalEnabled: {
      type: Boolean,
      default: false,
    },

    externalProviders: {
      type: Array,
      default: () => [],
    },

    internalEnabled: {
      type: Boolean,
      default: false,
    },

    internalSignUpEnabled: {
      type: Boolean,
      default: false,
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
    fPath () {
      return this.$route.fullPath
    },
  },

  watch: {
    fPath: {
      handler: function () {
        if (!this.finishExternal()) {
          this.gotoProfileIfAuthenticated()
        }
      },
    },
  },

  created () {
    if (!this.finishExternal()) {
      this.gotoProfileIfAuthenticated()
    }
  },

  methods: {
    finishExternal () {
      if (!this.externalEnabled) {
        return false
      }

      const token = this.$route.query.token
      if (token) {
        if (!tokenRegex.test(token)) {
          this.$router.push({ name: 'auth:login' })
        } else {
          this.exchangeToken(token)
          return true
        }
      }

      return false
    },

    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$SystemAPI.authExchangeAuthToken({ token }).then(({ jwt, user } = {}) => {
        this.finalize({ jwt, user })
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

      this.$SystemAPI.authInternalLogin(this.form).then(({ jwt, user } = {}) => {
        this.finalize({ jwt, user })
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
        this.$auth.goto(redirectTo)
      }
    },
  },
}
</script>
