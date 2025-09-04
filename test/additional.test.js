'use strict'

import assert from 'assert'
import maskObject from '../dist/index.esm.js'

// Test case 1: Custom propertyMatcher function
const testPropertyMatcher = {
  username: 'public',
  password: 'secret123',
  api: {
    key: 'api-key-123',
    publicData: 'not-sensitive'
  },
  data: {
    creditCard: '4111-1111-1111-1111',
    ssn: '123-45-6789'
  }
}

const maskedWithCustomMatcher = maskObject(testPropertyMatcher, {
  propertyMatcher: (key, normalizedKey, value, path) => {
    // Mask any key containing 'card' or 'ssn'
    if (normalizedKey.includes('card') || normalizedKey.includes('ssn')) {
      return true
    }
    // Mask anything at path api.key
    if (path.length === 2 && path[0] === 'api' && path[1] === 'key') {
      return true
    }
    // Use default sensitive property detection for others
    return ['password', 'secret', 'token', 'key'].includes(normalizedKey)
  }
})

assert.strictEqual(maskedWithCustomMatcher.username, 'public')
assert.strictEqual(maskedWithCustomMatcher.password.length, 8)
assert.strictEqual(maskedWithCustomMatcher.api.key.length, 8)
assert.strictEqual(maskedWithCustomMatcher.api.publicData, 'not-sensitive')
assert.strictEqual(maskedWithCustomMatcher.data.creditCard.length, 8)
assert.strictEqual(maskedWithCustomMatcher.data.ssn.length, 8)

// Test case 2: Circular references
const circularObj = {
  name: 'Circular Object',
  password: 'circular-secret'
}
circularObj.self = circularObj
circularObj.nested = {
  secret: 'nested-secret',
  parent: circularObj
}

const maskedCircular = maskObject(circularObj)
assert.strictEqual(maskedCircular.name, 'Circular Object')
assert.strictEqual(maskedCircular.password.length, 8)
assert.strictEqual(maskedCircular.self, maskedCircular) // Should maintain circular reference
assert.strictEqual(maskedCircular.nested.secret.length, 8)
assert.strictEqual(maskedCircular.nested.parent, maskedCircular)

// Test case 3: Non-string sensitive values
const nonStringValues = {
  password: 12345,
  token: true,
  secret: null,
  key: undefined,
  apiKey: { nested: 'object' },
  regularField: 'not-masked'
}

const maskedNonString = maskObject(nonStringValues)
assert.strictEqual(maskedNonString.password, 12345) // Should not mask non-strings
assert.strictEqual(maskedNonString.token, true)
assert.strictEqual(maskedNonString.secret, null)
assert.strictEqual(maskedNonString.key, undefined)
assert.deepStrictEqual(maskedNonString.apiKey, { nested: 'object' })
assert.strictEqual(maskedNonString.regularField, 'not-masked')

// Test case 4: Edge cases
const edgeCases = {
  password: '',
  emptyObj: {},
  emptyArray: [],
  nullValue: null,
  undefinedValue: undefined
}

const maskedEdgeCases = maskObject(edgeCases)
assert.strictEqual(maskedEdgeCases.password.length, 8) // Empty string will still be masked
assert.deepStrictEqual(maskedEdgeCases.emptyObj, {})
assert.deepStrictEqual(maskedEdgeCases.emptyArray, [])
assert.strictEqual(maskedEdgeCases.nullValue, null)
assert.strictEqual(maskedEdgeCases.undefinedValue, undefined)

// Test case 5: Deep nesting
const deepNested = {
  l1: {
    l2: {
      l3: {
        l4: {
          l5: {
            password: 'deep-password',
            token: 'deep-token',
            normal: 'not-sensitive'
          }
        }
      }
    }
  }
}

const maskedDeep = maskObject(deepNested)
assert.strictEqual(maskedDeep.l1.l2.l3.l4.l5.password.length, 8)
assert.strictEqual(maskedDeep.l1.l2.l3.l4.l5.token.length, 8)
assert.strictEqual(maskedDeep.l1.l2.l3.l4.l5.normal, 'not-sensitive')

console.log('All additional tests passed!')
