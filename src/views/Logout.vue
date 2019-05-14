<template>
  <div>
    <div v-if="error">
      <p class="error">Error: {{ error }}</p>
    </div>
    <div class="footnote">
      <router-link :to="{ name: 'login' }">Login</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Logout',

  data () {
    return {
      error: null,
    }
  },

  created () {
    this.$auth.JWT = null
    this.$auth.user = null
    this.$system.authLogout().then(() => {
      this.$router.push({ name: 'login' })
    }).catch(({ message } = {}) => {
      this.error = message
    })
  },
}
</script>
