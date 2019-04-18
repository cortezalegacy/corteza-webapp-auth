<template>
  <div>
    <router-view v-bind="settings" />
  </div>
</template>

<script>
export default {
  name: 'Auth',

  data () {
    return {
      processing: false,

      error: null,

      settings: {
        internalEnabled: null,
        internalPasswordResetEnabled: null,
        internalSignUpEmailConfirmationRequired: null,
        internalSignUpEnabled: null,

        externalEnabled: null,
        externalProviders: [],
      },
    }
  },

  created () {
    this.loadSettings()
  },

  methods: {
    loadSettings () {
      this.error = null
      this.processing = true

      this.$system.authSettings().then(ss => {
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
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
