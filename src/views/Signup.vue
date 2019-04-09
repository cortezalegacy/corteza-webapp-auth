<template>
  <auth-dialog title="Signup">
    <i class="img"></i>
    <fieldset class="manual-signon">
      <h2>use your email and password</h2>
      <!-- label for="username"> Username: </label -->
      <input type="email" name="email" placeholder="email@domain.tld" autocomplete="email">
      <!-- label for="password"> Password: </label -->
      <input type="password" name="password" placeholder="your password" autocomplete="current-password">
      <button type="button" class="login-btn">Connect</button>
    </fieldset>
    <div class="or">or</div>
    <fieldset class="sso-signons">
      <div class="sso-provider-wrap google">
        <input type="radio" hidden id="google" name="target" value="google" />
        <label for="google" ><i class="icon-google"></i><span class="text">Login with <strong>Google</strong></span></label>
      </div>
      <div class="sso-provider-wrap facebook">
        <input type="radio" hidden id="facebook" name="target" value="facebook" />
        <label for="facebook"><i class="icon-facebook"></i><span class="text">Login with <strong>Facebook</strong></span></label>
      </div>
    </fieldset>
    <hr />
    <router-link :to="{ name: 'signup'}">login</router-link>
    |
    <router-link :to="{ name: 'logout'}">logout</router-link>
  </auth-dialog>
</template>

<script>
export default {
  name: 'Signup',
  props: {
    msg: String,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
