# Building and Publishing JSMasker

This document outlines the steps to build and publish the JSMasker module to npm, including the browser-compatible version.

## Prerequisites

- Node.js (version 6.9.1 or higher)
- npm (comes with Node.js)
- Git

## Building

1. Clone the repository:
   ```
   git clone https://github.com/billchurch/jsmasker.git
   cd jsmasker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the CI script (lints, tests, and builds):
   ```
   npm run ci
   ```

   This will lint the code, run tests, and create a `dist` folder containing `jsmasker.min.js`, which is the browser-compatible version of the module.

## Releasing a New Version

We use `standard-version` to manage versioning and CHANGELOG generation based on conventional commits.

1. Make sure all your changes are committed.

2. Run the release script:
   ```
   npm run release
   ```

   This will:
   - Bump the version in package.json
   - Update the CHANGELOG.md
   - Create a new commit with these changes
   - Create a new tag with the new version number

3. Push the changes and tags:
   ```
   git push --follow-tags origin main
   ```

## Publishing to npm

1. Make sure you're logged in to npm:
   ```
   npm login
   ```

2. Publish the package:
   ```
   npm publish
   ```

   This will automatically run the `prepublishOnly` script, which builds the browser-compatible version before publishing.

Remember to follow [semantic versioning](https://semver.org/) principles when making changes to the package.

## Automated processes

- The CDN link in the README.md file is automatically updated during the build process to reflect the current version number.
- Linting is automatically run before tests.
- The `dist` folder is cleaned before each build.
- The `prepare` script ensures the package is built before it's packed for publishing.

## CI/CD

The `ci` script in package.json (`npm run ci`) runs linting, testing, and building in sequence. This can be used in your CI/CD pipeline to ensure all checks pass before deployment.

For example, in a GitHub Actions workflow:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - run: npm ci
    - run: npm run ci
```

This workflow will run on every push and pull request, ensuring that the code lints, tests pass, and builds successfully.