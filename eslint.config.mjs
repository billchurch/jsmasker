import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import n from 'eslint-plugin-n'
import { FlatCompat } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

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
  js.configs.recommended,
  prettierConfig,
  // TypeScript support for src/**/*.ts
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // Prefer TS-aware unused vars and allow underscore-prefixed
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
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
    },
    rules: {
      // Tests import built artifacts; disable missing-import checks
      'n/no-missing-import': 'off'
    }
  },
  // Properly include the Node.js plugin's recommended config using the compat utility
  ...nodeRecommendedConfig
  ,
  // Re-assert TS overrides after plugin presets (ensure precedence)
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser: tsParser },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  // Re-assert test overrides after plugin presets (ensure precedence)
  {
    files: ['test/**/*.js'],
    rules: {
      'n/no-missing-import': 'off'
    }
  }
]
