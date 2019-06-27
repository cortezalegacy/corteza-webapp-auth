<template>
  <div>
    <h1>{{ $t(`view.change-password.title`) }}</h1>
    <p v-if="passwordChanged">{{ $t(`view.change-password.changed`) }}</p>
    <div v-else>
      <form @submit.prevent="changePassword">
        <label for="email">{{ $t('view.change-password.form.email.label') }}</label>
        <input
                id="email"
                type="email"
                disabled
                v-model="user.email">
        <br />

        <div class="error" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>

        <label for="oldPassword">{{ $t('view.change-password.form.old-password.label') }}</label>
        <input
                id="oldPassword"
                type="password"
                required
                autocomplete="password"
                :placeholder="$t('view.change-password.form.old-password.placeholder')"
                v-model="form.oldPassword">
        <br />

        <label for="newPassword">{{ $t('view.change-password.form.new-password.label') }}</label>
        <input
                id="newPassword"
                type="password"
                required
                autocomplete="password"
                :placeholder="$t('view.change-password.form.new-password.placeholder')"
                v-model="form.newPassword">
        <br />

        <label for="passwordCheck">{{ $t('view.change-password.form.check-password.label') }}</label>
        <input
                id="passwordCheck"
                type="password"
                required
                autocomplete="password"
                :placeholder="$t('view.change-password.form.check-password.placeholder')"
                :class="{ error: !this.passwordCheckMatch }"
                v-model="form.newPasswordCheck">
        <br />

        <button type="submit"
                class="login-btn"
                :disabled="disabledSubmit">{{ $t('view.change-password.form.submit') }}</button>
      </form>
    </div>
    <div class="footnote">
      <router-link :to="{ name: 'auth:logout'}">{{ $t('link.logout') }}</router-link>
      |
      <router-link :to="{ name: 'auth:profile'}">{{ $t('link.profile-cta') }}</router-link>
    </div>
  </div>
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

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  created () {
    if (!this.internalEnabled) {
      this.$router.push({ name: 'auth:login' })
    }

    if (!this.$auth.is()) {
      this.$router.push({ name: 'auth:login' })
    }
  },

  methods: {
    changePassword () {
      this.error = null
      this.processing = true
      this.passwordChanged = false

      this.$SystemAPI.authInternalChangePassword(this.form).then(() => {
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
