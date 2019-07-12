<template>
  <b-card-body>
    <b-card-title>{{ $t('view.logout.title') }}</b-card-title>
    <div v-if="error">
      <p class="text-danger mb-1">{{ $t('general.error-tpl', { error }) }}</p>
    </div>
    <div class="text-center">
      <router-link :to="{ name: 'auth:login' }">{{ $t('link.login') }}</router-link>
    </div>
  </b-card-body>
</template>
<script>
export default {
  name: 'Logout',

  props: {
    afterLogout: { default: null },
  },

  data () {
    return {
      error: null,
    }
  },

  created () {
    if (!this.$SystemAPI) {
      return
    }

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
