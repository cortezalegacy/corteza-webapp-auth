<template>
  <main>
    <img alt="Crust logo" class="logo" src="../assets/crust-logo-with-tagline.png">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: 'AuthDialog',
  props: {
    title: String,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
main {
  position: relative;
  max-width: 320px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);

  img {
    &.logo {
      max-width: 80%;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
