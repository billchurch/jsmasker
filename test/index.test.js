'use strict'

import assert from 'assert'
import maskObject from '../dist/index.esm.js'
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

// Test case 11: Case-insensitive matching for default properties
const testObj11 = {
  // 'password' variations
  Password: 'upperCase',
  passWORD: 'mixedCase',
  password: 'lowerCase',
  // 'secret' variations
  SECRET: 'upperCase',
  Secret: 'titleCase',
  secret: 'lowerCase',
  // 'key' variations
  KEY: 'upper',
  Key: 'title',
  key: 'lower',
  // 'token' variations
  TOKEN: 'upper',
  Token: 'title',
  token: 'lower',
  // 'privatekey' variations
  PRIVATEKEY: 'upper',
  PrivateKey: 'title',
  privatekey: 'lower',
  // 'passphrase' variations
  PASSPHRASE: 'upper',
  Passphrase: 'title',
  passphrase: 'lower'
}

const maskedObj11 = maskObject(testObj11) // Using default properties

// Verify all variations of default properties are masked
// Password variations
assert.strictEqual(maskedObj11.Password, '********')
assert.strictEqual(maskedObj11.passWORD, '********')
assert.strictEqual(maskedObj11.password, '********')
// Secret variations
assert.strictEqual(maskedObj11.SECRET, '********')
assert.strictEqual(maskedObj11.Secret, '********')
assert.strictEqual(maskedObj11.secret, '********')
// Key variations
assert.strictEqual(maskedObj11.KEY, '********')
assert.strictEqual(maskedObj11.Key, '********')
assert.strictEqual(maskedObj11.key, '********')
// Token variations
assert.strictEqual(maskedObj11.TOKEN, '********')
assert.strictEqual(maskedObj11.Token, '********')
assert.strictEqual(maskedObj11.token, '********')
// Privatekey variations
assert.strictEqual(maskedObj11.PRIVATEKEY, '********')
assert.strictEqual(maskedObj11.PrivateKey, '********')
assert.strictEqual(maskedObj11.privatekey, '********')
// Passphrase variations
assert.strictEqual(maskedObj11.PASSPHRASE, '********')
assert.strictEqual(maskedObj11.Passphrase, '********')
assert.strictEqual(maskedObj11.passphrase, '********')

// Test case 12: Case-insensitive matching with custom properties
const testObj12 = {
  // Testing API key variations
  API_KEY: 'upperSnake',
  apiKey: 'camelCase',
  'api-key': 'withHyphen',
  ApiKey: 'pascalCase',
  api_key: 'snakeCase',

  // Testing access token variations
  ACCESS_TOKEN: 'upperSnake',
  accessToken: 'camelCase',
  'access-token': 'withHyphen',
  AccessToken: 'pascalCase',
  access_token: 'snakeCase',

  // Testing client secret variations
  CLIENT_SECRET: 'upperSnake',
  clientSecret: 'camelCase',
  'client-secret': 'withHyphen',
  ClientSecret: 'pascalCase',
  client_secret: 'snakeCase'
}

const maskedObj12 = maskObject(testObj12, {
  // Define custom properties to mask - include base form of each
  properties: ['api_key', 'access_token', 'client_secret'],
  maskChar: '*',
  maskLength: 6
})

// Verify API key variations are masked
assert.strictEqual(maskedObj12.API_KEY, '******')
assert.strictEqual(maskedObj12.apiKey, '******')
assert.strictEqual(maskedObj12['api-key'], '******')
assert.strictEqual(maskedObj12.ApiKey, '******')
assert.strictEqual(maskedObj12.api_key, '******')

// Verify access token variations are masked
assert.strictEqual(maskedObj12.ACCESS_TOKEN, '******')
assert.strictEqual(maskedObj12.accessToken, '******')
assert.strictEqual(maskedObj12['access-token'], '******')
assert.strictEqual(maskedObj12.AccessToken, '******')
assert.strictEqual(maskedObj12.access_token, '******')

// Verify client secret variations are masked
assert.strictEqual(maskedObj12.CLIENT_SECRET, '******')
assert.strictEqual(maskedObj12.clientSecret, '******')
assert.strictEqual(maskedObj12['client-secret'], '******')
assert.strictEqual(maskedObj12.ClientSecret, '******')
assert.strictEqual(maskedObj12.client_secret, '******')

// Test a nested object with custom properties
const testObj12Nested = {
  credentials: {
    API_KEY: 'nestedUpper',
    access_token: 'nestedLower',
    ClientSecret: 'nestedPascal'
  },
  configuration: {
    api_key: 'anotherNested',
    AccessToken: 'anotherNestedPascal',
    'client-secret': 'anotherNestedHyphen'
  }
}

const maskedObj12Nested = maskObject(testObj12Nested, {
  properties: ['api_key', 'access_token', 'client_secret'],
  maskChar: '*',
  maskLength: 6
})

// Verify nested properties are masked
assert.strictEqual(maskedObj12Nested.credentials.API_KEY, '******')
assert.strictEqual(maskedObj12Nested.credentials.access_token, '******')
assert.strictEqual(maskedObj12Nested.credentials.ClientSecret, '******')
assert.strictEqual(maskedObj12Nested.configuration.api_key, '******')
assert.strictEqual(maskedObj12Nested.configuration.AccessToken, '******')
assert.strictEqual(maskedObj12Nested.configuration['client-secret'], '******')

// Test case 13: Case-insensitive matching with nested objects
const testObj13 = {
  credentials: {
    Password: 'secret1',
    TOKEN: 'secret2',
    PRIVATE_KEY: 'secret3'
  }
}

const maskedObj13 = maskObject(testObj13)

// Verify nested properties are masked regardless of case
assert.strictEqual(maskedObj13.credentials.Password, '********')
assert.strictEqual(maskedObj13.credentials.TOKEN, '********')
assert.strictEqual(maskedObj13.credentials.PRIVATE_KEY, '********')

// Test case 14: Case-insensitive matching with arrays
const testObj14 = {
  SECRETS: ['normalSecret', 'UPPERSECRET', 'mixedSECRET'],
  Keys: ['normalKey', 'UPPERKEY', 'mixedKEY']
}

const maskedObj14 = maskObject(testObj14, {
  properties: ['secrets', 'keys'],
  maskChar: '*',
  maskLength: 4
})

maskedObj14.SECRETS.forEach((secret) => {
  assert.strictEqual(secret, '****')
})

maskedObj14.Keys.forEach((key) => {
  assert.strictEqual(key, '****')
})

console.log('All tests passed!')
