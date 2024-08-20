# JSMasker

![Bandit Mascot](images/bandit.png)

JSMasker is a flexible JavaScript module that masks sensitive properties in objects by replacing them with customizable masks. It can be used in both Node.js and browser environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Node.js Usage](#nodejs-usage)
  - [Browser Usage](#browser-usage)
  - [Integration Guides](#integration-guides)
- [Configuration Options](#configuration-options)
- [Features](#features)
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

You can include JSMasker directly in your HTML file using a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jsmasker@1.1.1/dist/jsmasker.min.js"></script>
```

Or download the `jsmasker.min.js` file from the `dist` folder in this repository and include it in your project:

```html
<script src="path/to/jsmasker.min.js"></script>
```

## Usage

### Node.js Usage

```javascript
const maskObject = require('jsmasker')

const sensitiveObject = {
  username: 'penelope',
  password: 'secretpassword',
  data: {
    key: 'sensitive-key',
    value: 'some-value'
  }
}

const maskedObject = maskObject(sensitiveObject)

console.log(maskedObject)
```

### Browser Usage

When used in a browser, JSMasker is available as a global function `JSMasker`:

```html
<script src="https://cdn.jsdelivr.net/npm/jsmasker@1.0.0/dist/jsmasker.min.js"></script>
<script>
  const sensitiveObject = {
    username: 'penelope',
    password: 'secretpassword',
    data: {
      key: 'sensitive-key',
      value: 'some-value'
    }
  }

  const maskedObject = JSMasker(sensitiveObject)

  console.log(maskedObject)
</script>
```
## Integration Guides

- [Integrating JSMasker with Webpack](WEBPACK_INTEGRATION.md)

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| properties | Array | ['password', 'key', 'secret', 'token'] | List of properties to mask |
| maskLength | number \| 'random' | 8 | Length of the mask or 'random' for variable length |
| minLength | number | 5 | Minimum length for random mask |
| maxLength | number | 15 | Maximum length for random mask |
| maskChar | string | '*' | Character to use for masking |
| fullMask | string \| boolean | false | String to use as full mask (e.g., 'REDACTED') or boolean to enable/disable full masking |

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