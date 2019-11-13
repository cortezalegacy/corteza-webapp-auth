export default {
  methods: {
    /**
     * Helper method, to parse & translate error messages.
     * @temp remove when API error messages are cleanned up
     * @param {String} error Raw error message
     * @returns {String} Parsed error message
     */
    parseError (error) {
      if (!error) {
        return error
      }

      const errCode = error.split(':').pop().trim()
      if (!errCode || !errCode.match(/^(\w+\.)+\w+$/g)) {
        return error
      }

      return this.$t(errCode)
    },
  },
}
