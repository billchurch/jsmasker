/* eslint-disable strict */

'use strict'

const assert = require('assert')
const maskObject = require('../src/index')

// Test case 1: Basic functionality
const testObj1 = {
  username: 'penelope',
  password: 'Nezuko123',
  data: {
    key: 'Hashira-key',
    value: 'Hashira'
  }
}

const maskedObj1 = maskObject(testObj1)

assert.strictEqual(maskedObj1.username, 'penelope')
assert.strictEqual(maskedObj1.password.length, 8)
assert.strictEqual(maskedObj1.data.key.length, 8)
assert.strictEqual(maskedObj1.data.value, 'Hashira')

// Test case 2: Custom properties to mask
const testObj2 = {
  username: 'chad',
  apiKey: '1234567890',
  data: 'some data'
}

const maskedObj2 = maskObject(testObj2, { properties: ['username', 'apiKey'] })

assert.strictEqual(maskedObj2.username.length, 8)
assert.strictEqual(maskedObj2.apiKey.length, 8)
assert.strictEqual(maskedObj2.data, 'some data')

// Test case 3: Random mask length
const testObj3 = {
  password: 'Nezuko123',
  token: 'abcdefg'
}

const maskedObj3 = maskObject(testObj3, {
  maskLength: 'random',
  minLength: 5,
  maxLength: 10
})

assert(maskedObj3.password.length >= 5 && maskedObj3.password.length <= 10)
assert(maskedObj3.token.length >= 5 && maskedObj3.token.length <= 10)

// Test case 4: Custom mask character
const testObj4 = {
  password: 'Nezuko123'
}

const maskedObj4 = maskObject(testObj4, { maskChar: '#' })

assert.strictEqual(maskedObj4.password, '########')

// Test case 5: Full mask as string
const testObj5 = {
  password: 'Nezuko123',
  data: {
    key: 'Hashira-key'
  }
}

const maskedObj5 = maskObject(testObj5, { fullMask: 'REDACTED' })

assert.strictEqual(maskedObj5.password, 'REDACTED')
assert.strictEqual(maskedObj5.data.key, 'REDACTED')

// Test case 6: Non-object input
const testValue = 'not an object'
const result = maskObject(testValue)

assert.strictEqual(result, testValue)

// New test case 7: Default values
const testObj7 = {
  password: 'Nezuko123',
  key: 'Hashira-key',
  secret: 'topsecret',
  token: '1234567890',
  other: 'non-sensitive'
}

const maskedObj7 = maskObject(testObj7)

assert.strictEqual(maskedObj7.password.length, 8)
assert.strictEqual(maskedObj7.key.length, 8)
assert.strictEqual(maskedObj7.secret.length, 8)
assert.strictEqual(maskedObj7.token.length, 8)
assert.strictEqual(maskedObj7.other, 'non-sensitive')

// New test case 8: Full mask as boolean
const testObj8 = {
  password: 'Nezuko123',
  key: 'Hashira-key'
}

const maskedObj8 = maskObject(testObj8, { fullMask: true })

assert.strictEqual(maskedObj8.password, '*********')
assert.strictEqual(maskedObj8.key, '***********')

// New test case 9: Explicit test for minLength and maxLength with random mask
const testObj9 = {
  password: 'Nezuko123'
}

const maskedObj9 = maskObject(testObj9, {
  maskLength: 'random',
  minLength: 3,
  maxLength: 6
})

assert(maskedObj9.password.length >= 3 && maskedObj9.password.length <= 6)

const testObj10 = {
  action: 'keyboard-interactive',
  responses: ['sensitive_password', 'another_sensitive_value']
}

const maskedObj10 = maskObject(testObj10, {
  properties: ['responses']
})
console.log(JSON.stringify(maskedObj10))

assert(Array.isArray(maskedObj10.responses))
assert.strictEqual(maskedObj10.responses.length, 2)
assert.strictEqual(maskedObj10.responses[0].length, 8)
assert.strictEqual(maskedObj10.responses[1].length, 8)
assert.strictEqual(maskedObj10.action, 'keyboard-interactive')

console.log('All tests passed!')
