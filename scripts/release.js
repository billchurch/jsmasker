const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Get next version using standard-version dry run
const getNextVersion = () => {
  const output = execSync('standard-version --dry-run').toString()
  const versionLine = output.split('\n').find(line => line.includes('bumping version'))
  const version = versionLine.split(' ').pop()
  return version
}

const nextVersion = getNextVersion()

// Build webpack with new version to update README
execSync('webpack --config scripts/webpack.config.js', { 
  env: { ...process.env, NEXT_VERSION: nextVersion }
})

// Stage README.md
execSync('git add README.md')

// Run standard-version with README.md included
const args = process.argv.includes('--first-release') ? '--first-release' : ''
execSync(`standard-version ${args} -a -s --files README.md`, { stdio: 'inherit' })
