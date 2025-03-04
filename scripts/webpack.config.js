const path = require('path')
const WebpackReadmePlugin = require('./webpack-readme-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'jsmasker.min.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'JSMasker',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
}
