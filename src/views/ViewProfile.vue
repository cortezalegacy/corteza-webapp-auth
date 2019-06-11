<template>
  <div>
    <dt>Email</dt>
    <dd>{{ user.email }}</dd>
    <dt>Name</dt>
    <dd>{{ user.name }}</dd>
    <dt>Handle</dt>
    <dd>{{ user.handle }}</dd>
    <div class="footnote">
      <router-link :to="{ name: 'logout'}">Logout</router-link>
      <span v-if="internalEnabled">
        | <router-link :to="{ name: 'change-password'}">Change your password</router-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewProfile',

  props: {
    internalEnabled: {
      type: Boolean,
    },
  },

  computed: {
    user () {
      return this.$auth.user || {}
    },
  },

  beforeCreate () {
    if (!this.$auth.is()) {
      this.$router.push({ name: 'login' })
    }
  },
}
</script>
