<template>
  <auth-dialog title="Change your password">
    <p v-if="passwordChanged">Password changed.</p>
    <div v-else>
      <form @submit.prevent="changePassword">
        <label for="email">Email:</label>
        <input
                id="email"
                type="email"
                disabled
                v-model="user.email">
        <br />

        <div class="error" v-if="error">Error: {{ error }}</div>

        <label for="oldPassword">Current password:</label>
        <input
                id="oldPassword"
                type="password"
                required
                placeholder="Your password"
                autocomplete="password"
                v-model="form.oldPassword">
        <br />

        <label for="newPassword">Password:</label>
        <input
                id="newPassword"
                type="password"
                required
                placeholder="Your password"
                autocomplete="password"
                v-model="form.newPassword">
        <br />

        <label for="passwordCheck">Repeat your password:</label>
        <input
                id="passwordCheck"
                type="password"
                required
                placeholder="Repeat your password"
                autocomplete="password"
                :class="{ error: !this.passwordCheckMatch }"
                v-model="form.newPasswordCheck">
        <br />

        <button type="submit"
                class="login-btn"
                :disabled="disabledSubmit">Submit</button>
      </form>
    </div>
    <div class="footnote">
      <router-link :to="{ name: 'logout'}">Logout</router-link>
      |
      <router-link :to="{ name: 'profile'}">Back to profile</router-link>
    </div>
  </auth-dialog>
</template>

<script>
export default {
  name: 'Profile',

  props: {
    internalEnabled: {
      type: Boolean,
    },
  },

  data () {
    return {
      processing: false,
      passwordChanged: false,
      error: null,

      form: {
        oldPassword: '',
        newPassword: '',
        newPasswordCheck: '',
      },
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing || !this.passwordCheckMatch
    },

    passwordCheckMatch () {
      const { newPassword, newPasswordCheck } = this.form
      return newPassword === newPasswordCheck
    },

    user () {
      return this.$auth.user
    },
  },

  created () {
    if (!this.internalEnabled) {
      this.$router.push({ name: 'login' })
    }

    if (!this.$auth.is()) {
      this.$router.push({ name: 'login' })
    }
  },

  methods: {
    changePassword () {
      this.error = null
      this.processing = true
      this.passwordChanged = false

      this.$system.authInternalChangePassword(this.form).then(() => {
        this.passwordChanged = true
      }).catch(({ message } = {}) => {
        this.error = message
      }).finally(() => {
        this.processing = false
      })
    },
  },
}
</script>
