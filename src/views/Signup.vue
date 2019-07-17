<template>
  <b-card-body>
    <b-card-title>{{ $t('view.signup.title') }}</b-card-title>
    <div class="text-center mb-5 external-providers" v-if="externalEnabled && externalProviders">
      <c-external-provider v-for="p in externalProviders"
                           :key="p.handle"
                           :onExternalAuth="onExternalAuth"
                           :pKind="p.handle"
                           :pIcon="p.icon || p.handle"
                           :pLabel="p.label"></c-external-provider>
    </div>
    <p v-if="pendingEmailConfirmation" class="email-pending">{{ $t('view.signup.pending-email-confirmation') }}</p>
    <div v-else>
      <b-form @submit.prevent="internalSignup" v-if="internalSignUpEnabled" class="signup-form">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'at']"></font-awesome-icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.email"
                        type="email"
                        name="email"
                        :label="$t('view.signup.form.email.label')"
                        :placeholder="$t('view.signup.form.email.placeholder')"
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
                        name="password"
                        :label="$t('view.signup.form.password.label')"
                        :placeholder="$t('view.signup.form.password.placeholder')"
                        required
                        autocomplete="password">
          </b-form-input>
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.name"
                        type="text"
                        name="name"
                        :label="$t('view.signup.form.name.label')"
                        :placeholder="$t('view.signup.form.name.placeholder')"
                        required
                        autocomplete="name">
          </b-form-input>
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
            <span class="input-group-text bg-primary text-white">
              <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.handle"
                        type="text"
                        name="handle"
                        :label="$t('view.signup.form.handle.label')"
                        :placeholder="$t('view.signup.form.handle.placeholder')"
                        autocomplete="handle">
          </b-form-input>
        </b-input-group>

        <b-form-group class="text-right mt-2">
          <b-button type="submit"
                    variant="primary"
                    :disabled="disabledSubmit">{{ $t('view.signup.form.submit') }}</b-button>
        </b-form-group>
        <div class="text-danger mb-1 error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>
      </b-form>
      <div class="text-center" v-if="internalSignUpEnabled">
        {{ $t('view.signup.existing-account') }}
        <router-link :to="{ name: 'auth:login'}">{{ $t('link.login') }}</router-link>
      </div>
    </div>
  </b-card-body>
</template>

<script>
export default {
  name: 'Signup',

  props: {
    afterSignup: { default: null },
    onExternalAuth: { default: null },

    externalEnabled: {
      type: Boolean,
    },

    externalProviders: {
      type: Array,
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
        window.location = redirectTo
      }
    },
  },
}
</script>
