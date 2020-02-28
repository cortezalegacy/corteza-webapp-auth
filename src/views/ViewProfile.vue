<template>
  <b-card-body if="user.email">
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
      <router-link :to="{ name: 'auth:logout'}">
        {{ $t('link.logout') }}
      </router-link>
      <span v-if="internalEnabled">
        | <router-link :to="{ name: 'auth:change-password'}">{{ $t('link.change-password') }}</router-link>
      </span>
    </div>
  </b-card-body>
</template>

<script>
import { system } from '@cortezaproject/corteza-js'

export default {
  name: 'ViewProfile',

  props: {
    internalEnabled: {
      type: Boolean,
    },

    // Also accepting defaultUser param so that we can test this in a story book
    // Might cause issues if you mess around with local storage
    defaultUser: {
      type: Object,
      required: false,
      default: undefined,
    },
  },

  data () {
    return {
      user: new system.User(this.defaultUser || this.$auth.user),
    }
  },

  created () {
    this.gotoLoginFormIfAnonymous()
  },

  mounted () {
    if (!this.user.email) {
      window.setTimeout(() => {
        this.user = this.$auth.user
      }, 500)
    }
  },
}
</script>
