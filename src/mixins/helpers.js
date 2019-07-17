export default {
  methods: {
    async gotoProfileIfAuthenticated () {
      return this.$auth.check(this.$SystemAPI).then((user) => {
        if (user) {
          this.$router.push({ name: 'auth:profile' })
        }
      }).catch((error) => {
        console.error(error)
      })
    },

    async gotoLoginFormIfAnonymous () {
      return this.$auth.check(this.$SystemAPI).then((user) => {
        if (!user) {
          this.$router.push({ name: 'auth:login' })
        }
      }).catch((error) => {
        console.error(error)
      })
    },
  },
}
