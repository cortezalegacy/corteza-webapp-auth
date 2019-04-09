<template>
  <main>
    <h1 v-if="title">{{ title }}</h1>
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: 'AuthDialog',
  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
