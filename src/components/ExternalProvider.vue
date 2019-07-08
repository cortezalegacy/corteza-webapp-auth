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
      return `${this.pIcon || this.pKind}`
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
