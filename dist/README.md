# JSMasker

![Bandit Mascot](images/bandit.png)

JSMasker is a flexible JavaScript module that masks sensitive properties in objects and arrays by replacing them with customizable masks. It can be used in both Node.js and browser environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Masking Objects](#masking-objects)
  - [Case-Insensitive Matching](#case-insensitive-matching)
  - [Masking Arrays](#masking-arrays)
  - [Nested Structures](#nested-structures)
- [Configuration Options](#configuration-options)
- [Examples](#examples)
- [Migration](#migration)
- [Building and Publishing](#building-and-publishing)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Node.js

```bash
npm install jsmasker
```

### Browser

Include JSMasker directly in your HTML file using a CDN:

```html
<!-- Latest -->
<script src="https://cdn.jsdelivr.net/npm/jsmasker@latest/dist/jsmasker.umd.min.js"></script>
<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/jsmasker@x.y.z/dist/jsmasker.umd.min.js"></script>
```
## Usage

### ESM Guidance

- For Node ESM projects (`"type": "module"`): `import maskObject from 'jsmasker'`.
- For CommonJS: `const maskObject = require('jsmasker')`.
- For bundlers (Vite/Rollup/Webpack): use the bare import `jsmasker`; the package exports map points to ESM.
- Avoid importing from internal paths like `jsmasker/src/*`; use the package entry to stay compatible.
- Types are included. In TypeScript, `import maskObject, { type MaskConfig } from 'jsmasker'`.

### Node (ESM)

```js
import maskObject from 'jsmasker'

const masked = maskObject({ password: 'secret' })
```

### Node (CommonJS)

```js
const maskObject = require('jsmasker')

const masked = maskObject({ password: 'secret' })
```

### Browser (UMD)

```html
<script src="/dist/jsmasker.umd.min.js"></script>
<script>
  const masked = JSMasker({ token: 'abc123' })
  console.log(masked)
</script>
```

### Masking Objects

```javascript
const sensitiveObject = {
  username: 'john_doe',
  password: 'secret123',
  data: {
    apiKey: 'abcdef123456'
  }
}

const maskedObject = maskObject(sensitiveObject)

console.log(maskedObject)
// Output:
// {
//   username: 'john_doe',
//   password: '********',
//   data: {
//     apiKey: '********'
//   }
// }
```

### Case-Insensitive Matching

JSMasker performs case-insensitive property matching and normalizes property names by removing special characters. This means properties will be masked regardless of their case or format. For example:

```javascript
const sensitiveData = {
  // All of these will be masked as they match 'password'
  password: 'secret1',
  Password: 'secret2',
  PASSWORD: 'secret3',
  pass_word: 'secret4',
  'pass-word': 'secret5',

  // All of these will be masked as they match 'apikey'
  apiKey: 'key1',
  API_KEY: 'key2',
  'api-key': 'key3',
  ApiKey: 'key4'
}

const maskedData = maskObject(sensitiveData)
// All matching properties will be masked regardless of case/format
```

Default properties that are automatically masked (case-insensitive):
- password
- key
- secret
- token
- privatekey
- passphrase

You can specify custom properties to mask, which will also be matched case-insensitively:

```javascript
const data = {
  ACCESS_TOKEN: 'abc123',
  accessToken: 'def456',
  access_token: 'ghi789'
}

const masked = maskObject(data, {
  properties: ['access_token']  // will match all variations
})
```

### Masking Arrays

Mask values in arrays by targeting the containing key:

```javascript
const data = {
  action: 'keyboard-interactive',
  responses: ['sensitive_password', 'another_sensitive_value']
}

const masked = maskObject(data, { properties: ['responses'] })
// masked.responses -> ['********', '********']
```

### Nested Structures

JSMasker handles nested objects and arrays:

```javascript
const complexData = {
  user: {
    name: 'John Doe',
    credentials: ['user123', 'password123']
  },
  apiKeys: ['key1', 'key2', 'key3']
}

const maskedData = maskObject(complexData, {
  properties: ['credentials', 'apiKeys']
})

console.log(maskedData)
// Output:
// {
//   user: {
//     name: 'John Doe',
//     credentials: ['*******', '***********']
//   },
//   apiKeys: ['****', '****', '****']
// }
```

## Configuration Options

- properties: array of strings. Default: `['password','key','secret','token','privatekey','passphrase']`
- propertyMatcher: optional function `(key, normalizedKey, value, path) => boolean`
- maskLength: number or `'random'` (default: `8`)
- minLength: number (default: `5`)
- maxLength: number (default: `15`)
- maskChar: string (default: `'*'`)
- fullMask: string or boolean (default: `false`)

## Examples

1. Using random mask length:

```javascript
const masked = maskObject(sensitiveData, { maskLength: 'random', minLength: 3, maxLength: 8 })
```

2. Masking specific array elements:

```javascript
const data = {
  publicInfo: ['John', 'Doe', '1990'],
  privateInfo: ['SSN123456', 'CC4321']
}

const masked = maskObject(data, { properties: ['privateInfo'] })
// Result:
// {
//   publicInfo: ['John', 'Doe', '1990'],
//   privateInfo: ['********', '********']
// }
```

3. Using a full mask string:

```javascript
const masked = maskObject(sensitiveData, { fullMask: 'REDACTED' })
```

## Features

### Nested Object Handling

JSMasker recursively traverses nested objects and arrays, applying the mask to sensitive properties at any level of nesting. This ensures that all sensitive data is properly masked, regardless of its position in the object structure.

### Full Mask Option

The `fullMask` option can be used in two ways:

1. As a string: When set to a string value (e.g., 'REDACTED'), all sensitive properties will be replaced with this exact string.
2. As a boolean: When set to `true`, sensitive properties will be fully masked using the specified `maskChar` repeated to match the original string length. When set to `false` (default), the standard masking behavior is applied.

### Non-Object Input Handling

If JSMasker receives a non-object input (such as a string, number, or null), it will return the input unchanged. This ensures that the function can be safely used even when the input type is uncertain.

### Custom Property Matching

While property lists work well for simple cases, sometimes you need more complex matching logic. JSMasker supports a custom property matcher function that gives you complete control over which properties should be masked:

```javascript
const sensitiveData = {
  user: {
    name: 'John Smith',
    ssn: '123-45-6789',
    creditCard: '4111111111111111',
    address: {
      street: '123 Main St',
      personal: {
        birthdate: '01/01/1980'
      }
    }
  }
}

const masked = maskObject(sensitiveData, {
  propertyMatcher: (key, normalizedKey, value, path) => {
    // Mask properties with specific names
    if (['ssn', 'creditcard'].includes(normalizedKey)) return true
    
    // Mask values that look like credit card numbers
    if (typeof value === 'string' && value.match(/^\d{16}$/)) return true
    
    // Mask any property inside a 'personal' object
    if (path.some(p => String(p).toLowerCase().replace(/[^a-z0-9]/g, '') === 'personal')) return true
    
    // Don't mask anything else
    return false
  }
})

console.log(masked)
// Output:
// {
//   user: {
//     name: 'John Smith',
//     ssn: '********',
//     creditCard: '********',
//     address: {
//       street: '123 Main St',
//       personal: {
//         birthdate: '********'
//       }
//     }
//   }
// }
```

The property matcher function receives four arguments:
- `key`: The original property key
- `normalizedKey`: The normalized property key (lowercase with special characters removed)
- `value`: The property value
- `path`: An array representing the path to the current property

#### When to use Property Lists vs. Custom Matcher Functions

**Use property lists when:**
- You have a set of well-defined field names to mask
- Your masking requirements are simple and name-based
- You want the simplest configuration possible

**Use custom matcher functions when:**
- You need to mask based on property values, not just names
- You want to use regular expressions for property matching
- Your masking logic depends on the property's location (path) in the object
- You need conditional logic that can't be expressed with just property names
- You want to implement dynamic or context-aware masking rules

## Examples

1. Using random mask length:

```javascript
const masked = maskObject(sensitiveObject, { maskLength: 'random', minLength: 3, maxLength: 8 })
```

2. Using a custom mask character:

```javascript
const masked = maskObject(sensitiveObject, { maskChar: '#' })
```

3. Using a full mask string:

```javascript
const masked = maskObject(sensitiveObject, { fullMask: 'REDACTED' })
```

4. Using boolean full mask:

```javascript
const masked = maskObject(sensitiveObject, { fullMask: true })
```

## Migration

This release updates packaging to work seamlessly with modern ESM bundlers (Vite/Rollup) and includes TypeScript types.

- What changed (>= 2.x):
  - Source is ESM-only; no UMD wrapper and no runtime `require`.
  - Builds ship three formats: `dist/index.esm.js`, `dist/index.cjs`, `dist/jsmasker.umd.min.js`.
  - TypeScript declarations are included at `dist/index.d.ts`.
  - Polyfills were removed; target is modern environments (Node >= 18, modern browsers).

- Previous issue fixed (<= 1.7.x):
  - A UMD wrapper caused a `require('./polyfills')` path to leak into browser bundles, leading to “require is not defined” in Vite/Rollup.

- Actions when upgrading:
  - Replace deep imports like `jsmasker/src/index.js` with `jsmasker`.
  - If your HTML referenced `dist/jsmasker.min.js`, switch to `dist/jsmasker.umd.min.js`.
  - Remove bundler aliases that pointed to internal source files.
  - TypeScript: import types directly from the package; no separate `@types` needed.

- Verify:
  - In Vite: import `jsmasker`, build, and confirm no `require(` appears in the output.

## Building and Publishing

Built with Vite (library mode). Outputs:
- `dist/index.esm.js` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/jsmasker.umd.min.js` (UMD, global `JSMasker`)
- `dist/index.d.ts` (TypeScript declarations)

JSMasker uses [release-please](https://github.com/googleapis/release-please) to automate the release process.

### How It Works

1. **Conventional Commits**: We continue to use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages. These structured commit messages allow release-please to automatically determine version bumps and generate changelogs.

2. **Automated Release PRs**: When commits are pushed to the main branch, release-please automatically creates or updates a release PR that:
   - Bumps the version in package.json
   - Updates the CHANGELOG.md
   - Updates any version references in documentation

3. **Publishing Process**:
   - When the release PR is merged, release-please automatically creates a GitHub release and tags the commit
   - Our GitHub Actions workflow then automatically publishes the package to npm

### Benefits of the New Process

- Fully automated versioning based on commit history
- Consistent changelog generation
- Reduced manual steps and potential for human error
- Streamlined release workflow

For local development and building, you can still use:

```bash
npm install   # Install dependencies
npm run ci    # Run linting, tests, and build
```

### TypeScript

Type definitions are bundled. Example:

```ts
import maskObject, { type MaskConfig } from 'jsmasker'

const config: MaskConfig = { maskChar: '#', maskLength: 10 }
const masked = maskObject({ secret: 'value' }, config)
```

For detailed information on our development workflow, please refer to the [BUILD.md](BUILD.md) file.
## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
