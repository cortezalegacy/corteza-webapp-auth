<template>
  <b-card-body>
    <b-card-title>{{ $t('view.signup.title') }}</b-card-title>
    <div class="d-flex w-100 justify-content-center">
      <div
        v-if="externalEnabled && externalProviders && externalProviders.length && !signUpDisabled"
        class="d-flex text-center mb-5 external-providers"
      >
        <c-external-provider
          v-for="p in externalProviders"
          :key="p.handle"
          class="flex-reset"
          :on-external-auth="onExternalAuth"
          :p-kind="p.handle"
          :p-icon="p.icon || p.handle"
          :p-label="p.label"
        />
      </div>
    </div>
    <p
      v-if="pendingEmailConfirmation"
      class="email-pending"
    >
      {{ $t('view.signup.pending-email-confirmation') }}
    </p>
    <div v-else>
      <b-form
        v-if="internalSignUpEnabled && !signUpDisabled"
        class="signup-form"
        @submit.prevent="internalSignup"
      >
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'at']" />
            </span>
          </b-input-group-prepend>
          <b-form-input
            v-model="form.email"
            type="email"
            name="email"
            :label="$t('view.signup.form.email.label')"
            :placeholder="$t('view.signup.form.email.placeholder')"
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
            name="password"
            :label="$t('view.signup.form.password.label')"
            :placeholder="$t('view.signup.form.password.placeholder')"
            required
            autocomplete="password"
          />
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'user']" />
            </span>
          </b-input-group-prepend>
          <b-form-input
            v-model="form.name"
            type="text"
            name="name"
            :label="$t('view.signup.form.name.label')"
            :placeholder="$t('view.signup.form.name.placeholder')"
            required
            autocomplete="name"
          />
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['far', 'smile']" />
            </span>
          </b-input-group-prepend>
          <b-form-input
            v-model="form.handle"
            type="text"
            name="handle"
            :state="handleState"
            :label="$t('view.signup.form.handle.label')"
            :placeholder="$t('view.signup.form.handle.placeholder')"
            autocomplete="handle"
            required
          />
        </b-input-group>

        <b-form-group class="text-right mt-2">
          <b-button
            type="submit"
            variant="primary"
            :disabled="disabledSubmit"
          >
            {{ $t('view.signup.form.submit') }}
          </b-button>
        </b-form-group>
        <div
          v-if="error"
          class="text-danger mb-1 error"
        >
          {{ $t('general.error-tpl', { error: parseError(error) }) }}
        </div>
      </b-form>
      <div
        v-if="signUpDisabled"
        class="bg-danger alert mb-0 p-3 mb-5 mt-5 text-white"
      >
        {{ signUpDisabled }}
      </div>
      <div
        v-if="internalSignUpEnabled"
        class="text-center"
      >
        {{ $t('view.signup.existing-account') }}
        <router-link :to="{ name: 'auth:login'}">
          {{ $t('link.login') }}
        </router-link>
      </div>
    </div>
  </b-card-body>
</template>

<script>
import ExternalProvider from 'corteza-webapp-auth/src/components/ExternalProvider'

export default {
  name: 'Signup',

  components: {
    'c-external-provider': ExternalProvider,
  },

  props: {
    afterSignup: {
      type: Function,
      default: null,
    },
    onExternalAuth: {
      type: Function,
      default: null,
    },

    externalEnabled: {
      type: Boolean,
      default: false,
    },

    externalProviders: {
      type: Array,
      default: () => [],
    },

    internalPasswordResetEnabled: {
      type: Boolean,
      default: false,
    },

    internalSignUpEnabled: {
      type: Boolean,
      default: false,
    },

    signUpDisabled: {
      type: String,
      default: null,
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

    handleState () {
      if (this.form.handle.length === 0) {
        return null
      }

      const re = /^[A-Za-z][0-9A-Za-z_\-.]*[A-Za-z0-9]$/
      return re.test(this.form.handle)
    },
  },

  created () {
    this.gotoProfileIfAuthenticated()
  },

  methods: {
    internalSignup () {
      if (!this.internalSignUpEnabled) {
        return
      }

      this.error = null
      this.processing = true
      this.pendingEmailConfirmation = false

      this.$SystemAPI.authInternalSignup(this.form).then(({ jwt, user } = {}) => {
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
        this.$auth.goto(redirectTo)
      }
    },
  },
}
</script>
