<template>
    <auth-dialog title="Logout">
        <div v-if="error">
            <p class="error">Error: {{ error }}</p>
        </div>
        <div class="footnote">
            <router-link :to="{ name: 'login' }">Login</router-link>
        </div>
    </auth-dialog>
</template>
<script>
export default {
  name: 'Logout',

  data () {
    return {
      error: null,
    }
  },

  beforeCreate () {
    this.$system.authLogout().then(() => {
      this.$auth.JWT = null
      this.$auth.user = null

      this.$router.push({ name: 'login' })
    }).catch(({ message } = {}) => {
      this.error = message
    })
  },
}
</script>
