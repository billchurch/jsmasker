# Integrating JSMasker with Webpack

This guide will walk you through the process of importing and using JSMasker in a web application that uses webpack as its build tool.

## Prerequisites

- Node.js and npm installed on your system
- A webpack-based web application project
- Basic familiarity with webpack and modern JavaScript

## Step 1: Install JSMasker

First, install JSMasker as a dependency in your project:

```bash
npm install jsmasker
```

## Step 2: Import JSMasker in your JavaScript

In the JavaScript file where you want to use JSMasker, import it like this:

```javascript
import maskObject from 'jsmasker';
```

Or, if you're using CommonJS syntax:

```javascript
const maskObject = require('jsmasker');
```

## Step 3: Use JSMasker in your code

Now you can use JSMasker in your code:

```javascript
const sensitiveData = {
  username: 'penelope',
  password: 'Nezuko123',
  api_key: 'abcdef123456'
};

const maskedData = maskObject(sensitiveData);

console.log(maskedData);
```

## Step 4: Configure webpack (if necessary)

In most cases, webpack will handle the import of JSMasker without any additional configuration. However, if you encounter any issues, you might need to add a rule to your webpack configuration.

In your `webpack.config.js` file, ensure you have a rule for handling JavaScript files:

```javascript
module.exports = {
  // ... other webpack config options
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

This configuration assumes you're using Babel to transpile your JavaScript. If you're not, you may need to adjust the loader accordingly.

## Step 5: Build your application

Run your webpack build command. This is typically:

```bash
npm run build
```

Or, if you're using webpack directly:

```bash
webpack
```

## Step 6: Include the built JavaScript in your HTML

Make sure your HTML file includes the webpack-generated JavaScript file. This is usually done automatically by webpack, but if not, you might need to add something like this to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Your app content -->
    <script src="dist/bundle.js"></script>
</body>
</html>
```

Replace `dist/bundle.js` with the actual path to your webpack output file.

## Troubleshooting

If you encounter any issues:

1. Check that JSMasker is correctly listed in your `package.json` dependencies.
2. Ensure that your webpack configuration is correctly set up to handle external modules.
3. If you're using any code splitting or lazy loading, make sure JSMasker is included in the appropriate bundle.
4. Check your browser's console for any error messages that might provide more information.

## Example: Using JSMasker in a React component

Here's an example of how you might use JSMasker in a React component:

```jsx
import React, { useState } from 'react';
import maskObject from 'jsmasker';

function SensitiveDataComponent() {
  const [data, setData] = useState({
    username: 'penelope',
    password: 'Nezuko123',
    api_key: 'abcdef123456'
  });

  const [maskedData, setMaskedData] = useState({});

  const handleMask = () => {
    setMaskedData(maskObject(data));
  };

  return (
    <div>
      <h2>Original Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleMask}>Mask Data</button>
      <h2>Masked Data:</h2>
      <pre>{JSON.stringify(maskedData, null, 2)}</pre>
    </div>
  );
}

export default SensitiveDataComponent;
```

This example demonstrates how to use JSMasker in a React component, showing both the original and masked data.

Remember to always handle sensitive data securely and never expose sensitive information to the client-side unnecessarily.