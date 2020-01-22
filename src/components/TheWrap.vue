<template>
  <div class="container h-100">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-md-8 col-lg-6">
        <b-card
          v-if="error"
          class="border-0 text-danger"
        >
          {{ error }}
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
      </div>
    </div>

    <small
      class="p-1 text-secondary position-absolute version"
    >
      {{ frontendVersion }}
    </small>
  </div>
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
  },

  computed: {
    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
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
