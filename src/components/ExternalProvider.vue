<template>
  <b-button variant="outline-primary"
            class="mr-1"
            size="lg"
            @click="redirect">
    <font-awesome-icon :icon="['fab', iconClass]"></font-awesome-icon><br>
    <small>{{ pLabel || pKind }}</small>
  </b-button>
</template>

<script>
export default {
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
      const ico = this.pIcon || this.pKind

      if (/^openid-connect\./.test(ico)) {
        return 'openid'
      }
      // @todo remove when backend adopts google auth instead of g+
      if (this.pIcon === 'gplus') {
        return 'google'
      }

      return ico
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
        this.$auth.goto(this.authUrl)
      }
    },
  },
}
</script>
