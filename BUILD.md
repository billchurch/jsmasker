# Building and Publishing JSMasker

This document outlines how JSMasker is built and published to npm, including the browser-compatible version.

## Prerequisites

- Node.js (version 18.0.0 or higher, Node 20 recommended for development)
- npm (comes with Node.js)
- Git

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/billchurch/jsmasker.git
   cd jsmasker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the CI script (lints, tests, and builds):
   ```bash
   npm run ci
   ```

   This will lint the code, run tests, and create a `dist` folder containing `jsmasker.min.js`, which is the browser-compatible version of the module.

## Automated Release Process

JSMasker uses [release-please](https://github.com/googleapis/release-please) to automate the versioning, changelog generation, and release process.

### How It Works

1. **Conventional Commits**: All commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Common prefixes include:
   - `feat:` - A new feature (triggers a minor version bump)
   - `fix:` - A bug fix (triggers a patch version bump)
   - `docs:` - Documentation changes only
   - `chore:` - Maintenance tasks
   - `BREAKING CHANGE:` - Breaking changes (triggers a major version bump)

2. **Automated Release Pull Requests**:
   - When commits are pushed to the main branch, release-please analyzes commit messages
   - It automatically creates or updates a release PR that:
     - Bumps the version in package.json
     - Updates CHANGELOG.md
     - Updates any version references in documentation

3. **Publishing Process**:
   - When the release PR is merged, release-please automatically:
     - Creates a GitHub release
     - Tags the commit with the new version
   - The GitHub Actions workflow then:
     - Checks out the code
     - Sets up Node.js
     - Installs dependencies
     - Runs tests
     - Builds the package
     - Publishes to npm

## Manual Releases (if needed)

In most cases, releases will be handled automatically. However, if you need to perform a manual build:

```bash
npm run build
```

This will create the browser-compatible version in the `dist` directory.

## CI/CD

The GitHub Actions workflow in `.github/workflows/release-please.yaml` handles:

1. Running release-please to manage version bumps and changelog updates
2. Testing and building the code when a release is created
3. Publishing to npm when a release is created

This automated process ensures consistent releases with proper versioning, changelogs, and build artifacts.