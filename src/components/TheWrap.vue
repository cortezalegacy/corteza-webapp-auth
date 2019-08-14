<template>
  <div class="container h-100">
    <div class="row justify-content-center align-items-center h-100">
      <div class="col-md-8 col-lg-6">
        <b-card class="border-0 text-danger" v-if="error">
          {{ error }}
        </b-card>

        <div class="loader" v-else-if="loading">
          <div class="logo"></div>
        </div>

        <main v-else>
          <a href="/"><div class="logo bg-white pt-5"><h1>Auth</h1></div></a>
          <b-card class="border-0">
            <slot></slot>
          </b-card>
          <b-card-footer class="text-right bg-light">
            <small class="text-muted"><a href="https://cortezaproject.org/" target="_blank">cortezaproject.org</a></small>
            <span>  |  </span>
            <small class="text-muted"><a href="https://github.com/cortezaproject/" target="_blank">Github</a></small>
          </b-card-footer>
        </main>
      </div>
    </div>
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
    },
  },
}
</script>
