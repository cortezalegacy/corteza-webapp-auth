<template>
  <div>
    <dt>Email</dt>
    <dd>{{ $auth.user.email }}</dd>
    <dt>Name</dt>
    <dd>{{ $auth.user.name }}</dd>
    <dt>Handle</dt>
    <dd>{{ $auth.user.handle }}</dd>
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

  beforeCreate () {
    if (!this.$auth.is()) {
      this.$router.push({ name: 'login' })
    }
  },
}
</script>
