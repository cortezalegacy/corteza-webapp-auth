<template>
  <main>
    <a href="/"><img alt="Crust logo" class="logo" src="../assets/crust-logo-with-tagline.png"></a>
    <section>
      <h1>{{ title }}</h1>
      <slot></slot>
    </section>
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
  h1 {
    margin: 0;
    padding: 0 0 20px 0;
    font-size: 18px;
  }

  position: relative;
  max-width: 320px;

  section {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  }

  img.logo {
    max-width: 80%;
    display: block;
    margin: 0 auto;
  }
}
</style>
