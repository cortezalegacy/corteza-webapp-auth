<template>
  <div>
    <h1>{{ $t(`view.profile.title`) }}</h1>
    <dt>{{ $t('view.profile.fields.email.label') }}</dt>
    <dd>{{ user.email }}</dd>
    <dt>{{ $t('view.profile.fields.name.label') }}</dt>
    <dd>{{ user.name }}</dd>
    <dt>{{ $t('view.profile.fields.handle.label') }}</dt>
    <dd>{{ user.handle }}</dd>
    <div class="footnote">
      <router-link :to="{ name: 'auth:logout'}">{{ $t('link.logout') }}</router-link>
      <span v-if="internalEnabled">
        | <router-link :to="{ name: 'auth:change-password'}">{{ $t('link.change-password') }}</router-link>
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

    user: {
      type: Object,
      default () {
        return this.$auth.user
      },
    },
  },

  i18nOptions: {
    namespaces: [ 'auth' ],
  },

  beforeCreate () {
    if (!this.$auth.is()) {
      this.$router.push({ name: 'auth:login' })
    }
  },
}
</script>
