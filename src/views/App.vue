<template>
  <c-the-wrap
    :loading="processing"
    :error="error"
    :error-details="errorDetails"
  >
    <router-view v-bind="settings" />
    <vue-progress-bar />
  </c-the-wrap>
</template>
<script>
export default {
  name: 'Auth',

  data () {
    return {
      processing: true,

      error: null,
      errorDetails: null,

      settings: {
        internalEnabled: null,
        internalPasswordResetEnabled: null,
        internalSignUpEmailConfirmationRequired: null,
        internalSignUpEnabled: null,
        signUpDisabled: null,

        externalEnabled: null,
        externalProviders: [],
      },
    }
  },

  created () {
    if (!this.$SystemAPI) {
      return
    }

    this.error = null
    this.processing = true

    this.$SystemAPI.authSettings().then((ss = {}) => {
      if (!ss || typeof ss !== 'object') {
        throw new Error('Unexpected data returned from the API')
      }

      for (var k in this.settings) {
        if (ss[k] !== undefined) {
          this.settings[k] = ss[k]
        }
      }

      // For now, sort by label just to have a stable order
      // we'll support custom sort order of external providers later.
      if (Array.isArray(this.settings.externalProviders)) {
        this.settings.externalProviders = this.settings.externalProviders.sort((a, b) => {
          return a.label.localeCompare(b.label)
        })
      }
    }).catch(({ message } = {}) => {
      if (message !== 'Network Error') {
        // Do not clear JWT & user values
        // in case of a network error
        this.$auth.JWT = undefined
        this.$auth.user = undefined
      }

      this.error = message
      this.errorDetails = 'Could not read authentication system settings ' +
              '(' + window.SystemAPI + this.$SystemAPI.authSettingsEndpoint() + '). ' +
              'Inspect your settings or contact your IT team.'
    }).finally(() => {
      this.processing = false
    })
  },
}
</script>
