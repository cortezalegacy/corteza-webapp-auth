<template>
  <b-card-body>
    <b-card-title>{{ $t(`view.reset-password.title`) }}</b-card-title>
    <div v-if="!user">
      <div
        v-if="error"
        class="text-danger mb-1 error"
      >
        {{ $t('general.error-tpl', { error: parseError(error) }) }}
      </div>
      <div v-else>
        {{ $t('view.reset-password.validating-token') }}
      </div>
    </div>
    <b-form
      v-else
      class="reset-form"
      @submit.prevent="changePassword"
    >
      {{ $t(`view.reset-password.set-new-password`, { user }) }}

      <div
        v-if="error"
        class="text-danger mb-1 error"
      >
        {{ $t('general.error-tpl', { error: parseError(error) }) }}
      </div>

      <b-input-group>
        <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']" />
          </span>
        </b-input-group-prepend>
        <b-form-input
          v-model="form.password"
          type="password"
          name="password"
          :label="$t('view.reset-password.form.new-password.label')"
          :placeholder="$t('view.reset-password.form.new-password.placeholder')"
          required
          autocomplete="password"
        />
      </b-input-group>
      <b-form-group class="text-right mt-2">
        <b-button
          type="submit"
          variant="primary"
          :disabled="disabledSubmit"
        >
          {{ $t('view.reset-password.form.reset') }}
        </b-button>
      </b-form-group>
    </b-form>
    <div class="text-center mt-2">
      <router-link :to="{ name: 'auth:login' }">
        {{ $t('link.login-cta' ) }}
      </router-link>
    </div>
  </b-card-body>
</template>

<script>
import { tokenRegex } from 'corteza-webapp-auth/src/lib/common'

export default {
  name: 'ResetPassword',

  data () {
    return {
      processing: false,

      error: null,

      user: null,
      token: null,

      form: {
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
    const { token = null } = this.$route.query

    if (token) {
      if (!tokenRegex.test(token)) {
        this.error = this.$t('view.reset-password.error.invalid-token')
      } else {
        this.exchangeToken(token)
      }
    } else {
      this.error = this.$t('view.reset-password.error.missing-token')
    }
  },

  methods: {
    exchangeToken (token) {
      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalExchangePasswordResetToken({ token }).then(({ token, user } = {}) => {
        this.token = token
        this.user = user
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },

    changePassword () {
      if (!this.token) {
        return false
      }

      this.error = null
      this.processing = true

      this.$SystemAPI.authInternalResetPassword({ token: this.token, ...this.form }).then(({ jwt, user } = {}) => {
        this.$auth.JWT = jwt
        this.$auth.user = user
        this.$router.push({ name: 'auth:profile' })
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
