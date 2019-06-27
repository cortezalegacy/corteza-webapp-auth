<template>
  <div>
    <h1>{{ $t(`view.logout.title`) }}</h1>
    <div v-if="error">
      <p class="error">{{ $t('general.error-tpl', { error }) }}</p>
    </div>
    <div class="footnote">
      <router-link :to="{ name: 'auth:login' }">{{ $t('link.login') }}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Logout',

  props: {
    afterLogout: { default: null },
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  data () {
    return {
      error: null,
    }
  },

  created () {
    this.$SystemAPI.authLogout().then(() => {
      this.$auth.JWT = null
      this.$auth.user = null

      if (this.afterLogout) {
        this.afterLogout()
      } else {
        this.$router.push({ name: 'auth:login' })
      }
    }).catch(({ message } = {}) => {
      this.error = message
    })
  },
}
</script>
