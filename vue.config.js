const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appName: 'auth',
  appLabel: 'Corteza Auth',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-auth',
})
