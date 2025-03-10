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
<!-- For latest version -->
<script src="https://cdn.jsdelivr.net/npm/jsmasker@latest/dist/jsmasker.min.js"></script>
<!-- Or for a specific version -->
<script src="https://cdn.jsdelivr.net/npm/jsmasker@x.y.z/dist/jsmasker.min.js"></script>
```
## Usage

### Masking Objects

```javascript
const maskObject = require('jsmasker')

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

JSMasker can also mask elements within arrays:

```javascript
const maskObject = require('jsmasker')

const sensitiveArray = ['public', 'secret123', 'private']

const maskedArray = maskObject(sensitiveArray, {
  properties: [''] // This will mask all elements
})

console.log(maskedArray)
// Output: ['******', '********', '******']
```

### Nested Structures

JSMasker handles nested objects and arrays:

```javascript
const maskObject = require('jsmasker')

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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| properties | Array | ['password', 'key', 'secret', 'token'] | List of properties to mask |
| maskLength | number \| 'random' | 8 | Length of the mask or 'random' for variable length |
| minLength | number | 5 | Minimum length for random mask |
| maxLength | number | 15 | Maximum length for random mask |
| maskChar | string | '*' | Character to use for masking |
| fullMask | string \| boolean | false | String to use as full mask (e.g., 'REDACTED') or boolean to enable/disable full masking |

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
};

const masked = maskObject(sensitiveData, {
  propertyMatcher: (key, normalizedKey, value, path) => {
    // Mask properties with specific names
    if (['ssn', 'creditcard'].includes(normalizedKey)) return true;
    
    // Mask values that look like credit card numbers
    if (typeof value === 'string' && value.match(/^\d{16}$/)) return true;
    
    // Mask any property inside a 'personal' object
    if (path.some(p => normalizePropertyName(p) === 'personal')) return true;
    
    // Don't mask anything else
    return false;
  }
});

console.log(masked);
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
const masked = JSMasker(sensitiveObject, { maskLength: 'random', minLength: 3, maxLength: 8 })
```

2. Using a custom mask character:

```javascript
const masked = JSMasker(sensitiveObject, { maskChar: '#' })
```

3. Using a full mask string:

```javascript
const masked = JSMasker(sensitiveObject, { fullMask: 'REDACTED' })
```

4. Using boolean full mask:

```javascript
const masked = JSMasker(sensitiveObject, { fullMask: true })
```

## Building and Publishing

JSMasker now uses [release-please](https://github.com/googleapis/release-please) to automate the release process. This replaces our previous manual process that used standard-version.

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

For detailed information on our development workflow, please refer to the [BUILD.md](BUILD.md) file.
## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

