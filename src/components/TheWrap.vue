<template>
  <b-container
    fluid
    class="h-100 overflow-auto"
  >
    <b-row class="justify-content-center align-items-center h-100">
      <b-col
        sm="10"
        md="8"
        lg="4"
      >
        <b-card
          v-if="error"
          class="border-0"
          header-bg-variant="danger"
          header-text-variant="light"
          :header="error"
        >
          <p>{{ errorDetails }}</p>

          Settings:
          <b-container class="p-0">
            <b-row no-gutters>
              <b-col cols="6">
                System API URL
              </b-col>
              <b-col cols="6">
                <b-link>{{ systemApiBaseURL }}</b-link>
              </b-col>
            </b-row>
            <b-row no-gutters>
              <b-col cols="6">
                Compose API URL
              </b-col>
              <b-col cols="6">
                <b-link>{{ composeApiBaseURL }}</b-link>
              </b-col>
            </b-row>
            <b-row no-gutters>
              <b-col cols="6">
                Messaging API URL
              </b-col>
              <b-col cols="6">
                <b-link>{{ messagingApiBaseURL }}</b-link>
              </b-col>
            </b-row>
          </b-container>
        </b-card>

        <div
          v-else-if="loading"
          class="loader"
        >
          <div class="logo" />
        </div>

        <main v-else>
          <a href="/"><div class="logo bg-white pt-5"><h1>Auth</h1></div></a>
          <b-card class="border-0">
            <slot />
          </b-card>
          <b-card-footer class="text-right bg-light">
            <small class="text-muted"><a
              href="https://cortezaproject.org/"
              target="_blank"
            >cortezaproject.org</a></small>
            <span>  |  </span>
            <small class="text-muted"><a
              href="https://github.com/cortezaproject/"
              target="_blank"
            >Github</a></small>
          </b-card-footer>
        </main>
      </b-col>
    </b-row>

    <small
      class="p-1 text-secondary position-absolute version"
    >
      {{ frontendVersion }}
    </small>
  </b-container>
</template>
<script>
export default {
  name: 'TheWrap',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default () { return false },
    },

    error: {
      type: String,
      required: false,
      default: '',
    },

    errorDetails: {
      type: String,
      required: false,
      default: '',
    },
  },

  computed: {
    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
    },

    systemApiBaseURL () {
      return window.SystemAPI
    },

    composeApiBaseURL () {
      return window.ComposeAPI
    },

    messagingApiBaseURL () {
      return window.MessagingAPI
    },
  },
}
</script>
<style lang="scss" scoped>
.version {
  bottom: 0;
  right: 0;
}
</style>
