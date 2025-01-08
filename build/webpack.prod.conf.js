const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './src/index.js',
  output: {
    filename: 'vue-i18n-xlsx-view.js',
    library: {
      name: 'VueI18nXlsxView',
      type: 'umd',
    },
    globalObject: "typeof self !== 'undefined' ? self : this",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console.log
          },
          mangle: false, // 禁用变量和函数名混淆
        },
        extractComments: false // 禁用提取注释
      })
    ]
  }
})
