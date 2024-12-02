/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')

class WebpackReadmePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('WebpackReadmePlugin', () => {
      const version =
        process.env.NEXT_VERSION || require('../package.json').version

      // Use this version when updating the README CDN link
      const readmePath = path.resolve(__dirname, '../README.md')

      let readme = fs.readFileSync(readmePath, 'utf8')

      // Update CDN link
      readme = readme.replace(
        /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/jsmasker@.*\/dist\/jsmasker\.min\.js"><\/script>/,
        `<script src="https://cdn.jsdelivr.net/npm/jsmasker@${version}/dist/jsmasker.min.js"></script>`
      )

      fs.writeFileSync(readmePath, readme)
      console.log('README.md updated with new CDN link.')
    })
  }
}

module.exports = WebpackReadmePlugin
