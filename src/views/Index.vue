<template>
  <div>
    <div class="error" v-if="error">{{ error }}</div>
    <router-view v-bind="settings"
                 v-else-if="!this.processing"/>
    <div class="loader" v-else>
      <img :src="logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',

  data () {
    return {
      logo: require('@/assets/crust-logo-with-tagline.png'),

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
        if (message !== 'Network Error') {
          this.$auth.JWT = null
          this.$auth.user = null
        }

        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@keyframes flickerAnimation {
  0% { opacity: 0.6; }
  50% { opacity: 0.1; }
  100% { opacity: 0.6; }
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  img {
    align-self: center;
    opacity: 0.7;
    animation: flickerAnimation 3s infinite;
  }
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E85568;
  font-size: 24px;
  background-color: #FFFFFF;
  height: 20vh;
  top: 40vh;
  text-align: center;
}
</style>
