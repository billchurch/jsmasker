const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Get next version using conventional-recommended-bump
const getNextVersion = () => {
  const pkg = require('../package.json')
  const currentVersion = pkg.version
  const recommendedBump = execSync(
    'npx conventional-recommended-bump --preset angular'
  )
    .toString()
    .trim()

  const [major, minor, patch] = currentVersion.split('.')
  switch (recommendedBump) {
    case 'major':
      return `${Number(major) + 1}.0.0`
    case 'minor':
      return `${major}.${Number(minor) + 1}.0`
    default:
      return `${major}.${minor}.${Number(patch) + 1}`
  }
}

const nextVersion = getNextVersion()

// Build webpack with new version to update README
execSync('webpack --config scripts/webpack.config.js', {
  env: { ...process.env, NEXT_VERSION: nextVersion }
})

// Run standard-version for real
const args = process.argv.includes('--first-release') ? '--first-release' : ''
execSync(`npx standard-version ${args} -a -s`, { stdio: 'inherit' })
