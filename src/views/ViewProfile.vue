<template>
  <auth-dialog title="Your Crust profile">
    <template v-if="$auth.user">
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
    </template>
  </auth-dialog>
</template>

<script>
export default {
  name: 'ViewProfile',

  props: {
    internalEnabled: {
      type: Boolean,
    },
  },

  created () {
    if (!this.$auth.is()) {
      this.$router.push({ name: 'login' })
    }
  },
}
</script>
