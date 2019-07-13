<template>
  <div v-if="internalEnabled">
    <b-card-title>{{ $t(`view.change-password.title`) }}</b-card-title>
    <p v-if="passwordChanged">{{ $t(`view.change-password.changed`) }}</p>
    <div v-else>
      <b-form @submit.prevent="changePassword">
        <b-input-group>
          <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'at']"></font-awesome-icon>
          </span>
          </b-input-group-prepend>
          <b-form-input v-model="user.email"
                        type="email"
                        name="email"
                        disabled>
          </b-form-input>
        </b-input-group>

        <div class="text-danger mb-1" v-if="error">{{ $t('general.error-tpl', { error }) }}</div>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']"></font-awesome-icon>
          </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.oldPassword"
                        type="password"
                        :label="$t('view.change-password.form.old-password.label')"
                        :placeholder="$t('view.change-password.form.old-password.placeholder')"
                        required
                        autocomplete="password"></b-form-input>
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']"></font-awesome-icon>
          </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.newPassword"
                        type="password"
                        :label="$t('view.change-password.form.new-password.label')"
                        :placeholder="$t('view.change-password.form.new-password.placeholder')"
                        required
                        autocomplete="password"></b-form-input>
        </b-input-group>

        <b-input-group class="mt-2">
          <b-input-group-prepend>
          <span class="input-group-text bg-primary text-white">
            <font-awesome-icon :icon="['fas', 'key']"></font-awesome-icon>
          </span>
          </b-input-group-prepend>
          <b-form-input v-model="form.newPasswordCheck"
                        type="password"
                        :label="$t('view.change-password.form.check-password.label')"
                        :placeholder="$t('view.change-password.form.check-password.placeholder')"
                        required
                        :class="{ 'text-danger mb-1': !this.passwordCheckMatch }"
                        autocomplete="password"></b-form-input>
        </b-input-group>

        <b-form-group class="text-right mt-2">
          <b-button type="submit"
                    variant="primary"
                    :disabled="disabledSubmit">{{ $t('view.change-password.form.submit') }}</b-button>
        </b-form-group>
      </b-form>
    </div>
    <div>
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

  created () {
    this.gotoLoginFormIfAnonymous()

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
