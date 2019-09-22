const buildVueConfig = require('./vue.config-builder')

module.exports = buildVueConfig({
  appFlavour: 'Corteza',
  appName: 'auth',
  appLabel: 'Corteza Auth',
  theme: 'corteza-base',
  packageAlias: 'corteza-webapp-auth',
})
