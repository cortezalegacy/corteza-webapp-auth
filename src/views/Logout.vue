<template>
  <b-card-body>
    <b-card-title>{{ $t('view.logout.title') }}</b-card-title>
    <div
      v-if="error"
      class="error"
    >
      <p class="text-danger mb-1">
        {{ $t('general.error-tpl', { error: parseError(error) }) }}
      </p>
    </div>
    <div class="text-center">
      <router-link :to="{ name: 'auth:login' }">
        {{ $t('link.login') }}
      </router-link>
    </div>
  </b-card-body>
</template>
<script>
export default {
  name: 'Logout',

  props: {
    afterLogout: {
      type: Function,
      default: null,
    },
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

    this.$auth.logout(this.$SystemAPI).then(() => {
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
