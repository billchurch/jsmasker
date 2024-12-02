const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Get next version without bumping
const nextVersion = execSync('npx standard-version --dry-run --skip.bump')
  .toString()
  .match(/bumping version in package\.json from .* to (.*)/)[1]
  .trim()

// Build webpack with new version to update README
execSync('webpack --config scripts/webpack.config.js', {
  env: { ...process.env, NEXT_VERSION: nextVersion }
})

// Run standard-version for real
const args = process.argv.includes('--first-release') ? '--first-release' : ''
execSync(`npx standard-version ${args} -a -s`, { stdio: 'inherit' })
