<template>
  <b-card-body>
    <b-card-title>{{ $t(`view.profile.title`) }}</b-card-title>
    <dt>{{ $t('view.profile.fields.email.label') }}</dt>
    <dd>{{ user.email }}</dd>
    <template v-if="user.name">
    <dt>{{ $t('view.profile.fields.name.label') }}</dt>
    <dd>{{ user.name }}</dd>
    </template>
    <template v-if="user.handle">
      <dt>{{ $t('view.profile.fields.handle.label') }}</dt>
      <dd>{{ user.handle }}</dd>
    </template>
    <div>
      <router-link :to="{ name: 'auth:logout'}">{{ $t('link.logout') }}</router-link>
      <span v-if="internalEnabled">
        | <router-link :to="{ name: 'auth:change-password'}">{{ $t('link.change-password') }}</router-link>
      </span>
    </div>
  </b-card-body>
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
        return this.$auth.user || {}
      },
    },
  },

  created () {
    this.gotoLoginFormIfAnonymous()
  },
}
</script>
