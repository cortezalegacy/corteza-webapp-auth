var webpack = require('webpack')
var exec = require('child_process').execSync

if (process.env.NODE_ENV === 'test') {
  var Vue = require('vue')
  Vue.config.devtools = false
  Vue.config.productionTip = false
}

const publicPath = process.env.NODE_ENV === 'production' ? '/auth' : '/'

let optimization
if (process.env.NODE_ENV !== 'test') {
  // Enabling optimization when running unit testing confuses
  // mocha (it does not find any tests)
  optimization = {
    usedExports: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },

        themes: {
          test: /[\\/]src[\\/]themes[\\/]/,
          name: 'themes',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  }
}

const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  publicPath,
  lintOnSave: true,
  configureWebpack: {
    // other webpack options to merge in ...
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(('' + exec('git describe --always --tags')).trim()),
        BUILD_TIME: JSON.stringify((new Date()).toISOString()),
      }),

      new StyleLintPlugin({
        files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
      }),
    ],

    optimization,
  },

  chainWebpack: config => {
    // Do not copy config files (deployment procedure will do that)
    config.plugin('copy').tap(options => {
      options[0][0].ignore.push('config*js')
      return options
    })

    const scssNormal = config.module.rule('scss').oneOf('normal')

    scssNormal.use('sass-loader')
      .loader('sass-loader')
      .tap(options => ({
        ...options,
        sourceMap: true,
        sourceMapContents: false,
      }))

    // Load CSS assets according to their location
    scssNormal.use('resolve-url-loader')
      .loader('resolve-url-loader').options({
        keepQuery: true,
      })
      .before('sass-loader')
  },

  // devServer Options don't belong into `configureWebpack`
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  css: {
    sourceMap: process.env['NODE_ENV'] === 'development',
  },
}
