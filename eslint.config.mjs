import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import n from 'eslint-plugin-n'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname
})

// Use the compat utility to convert the Node.js plugin's recommended config
const nodeRecommendedConfig = compat.config({
  extends: ['plugin:n/recommended']
})

export default [
  // Add ignore patterns for test directory if desired
  {
    ignores: ['./test/**']
  },
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier,
      n
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'func-names': 'off',
      'no-process-exit': 'off',
      'object-shorthand': 'off',
      'class-methods-use-this': 'off',
      'space-before-function-paren': 'off',
      'no-undef': 'off'
    }
  },
  // Fix for polyfills.js - add CommonJS globals
  {
    files: ['src/polyfills.js'],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly'
      }
    }
  },
  // Fix for test files - add CommonJS globals
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly'
      }
    }
  },
  // Properly include the Node.js plugin's recommended config using the compat utility
  ...nodeRecommendedConfig
]
