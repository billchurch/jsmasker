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
<script src="https://cdn.jsdelivr.net/npm/jsmasker@1.3.0/dist/jsmasker.min.js"></script>
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

For detailed instructions on building and publishing JSMasker, please refer to the [BUILD.md](BUILD.md) file.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.