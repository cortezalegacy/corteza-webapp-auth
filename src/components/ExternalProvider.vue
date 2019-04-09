<template>
  <div class="provider">
    <a :href="url"><i :class="iconClass"></i>
      <span class="text"><slot>Login with <strong>{{ label || kind }}</strong></slot></span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'AuthDialog',
  props: {
    kind: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconClass () {
      return `icon-${this.icon || this.kind}`
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
