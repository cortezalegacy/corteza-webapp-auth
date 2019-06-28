<template>
  <b-button :class="['provider', pKind]" @click="redirect">
    <i :class="['icon', iconClass]"></i>
    <span class="text"><slot>{{ $t('login-with')  }} <strong>{{ pLabel || pKind }}</strong></slot></span>
  </b-button>
</template>

<script>
export default {
  name: 'ExternalProvider',
  props: {
    pKind: {
      type: String,
      required: true,
    },
    pIcon: {
      type: String,
      required: false,
    },
    pLabel: {
      type: String,
      required: false,
    },
    pUrl: {
      type: String,
      required: false,
    },
    onExternalAuth: { default: null },
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
    keyPrefix: 'components.external-provider',
  },

  computed: {
    iconClass () {
      return `icon-${this.pIcon || this.pKind}`
    },

    authUrl () {
      return this.pUrl || `${this.$SystemAPI.baseURL}${this.$SystemAPI.authSettingsEndpoint()}external/${this.pKind}`
    },
  },

  methods: {
    redirect () {
      if (this.onExternalAuth) {
        this.onExternalAuth(this.authUrl)
      } else {
        window.location = this.authUrl
      }
    },
  },
}
</script>
