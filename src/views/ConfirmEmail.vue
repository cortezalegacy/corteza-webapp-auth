<template>
  <auth-dialog title="Email confirmation">
    ....
  </auth-dialog>
</template>

<script>
export default {
  name: 'ConfirmEmail',
  props: {
    msg: String,
  },

  data () {
    return {
      processing: false,

      error: null,
    }
  },

  computed: {
    disabledSubmit () {
      return this.processing
    },
  },

  created () {

  },

  methods: {
    internalSignup () {
      this.error = null
      this.processing = true

      this.$system.authInternalSignup(this.form).then(r => {
        this.processing = false
      }).catch(({ message } = {}) => {
        this.error = message
        this.processing = false
      })
    },
  },
}
</script>
<style scoped>
.error {
  color: red;
}
</style>
