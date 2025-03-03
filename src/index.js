/* eslint-disable no-undef, no-restricted-globals */
/* eslint-disable node/no-unsupported-features/es-builtins, node/no-unsupported-features/es-syntax */

;(function (factory) {
  /* global define */

  // Detect the global object
  const getGlobalObject = function () {
    if (typeof globalThis !== 'undefined') return globalThis
    if (typeof window !== 'undefined') return window
    if (typeof global !== 'undefined') return global
    if (typeof self !== 'undefined') return self
    // eslint-disable-next-line no-new-func
    return Function('return this')() // Fallback
  }

  const root = getGlobalObject()

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./polyfills'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    // eslint-disable-next-line global-require
    module.exports = factory(require('./polyfills'))
  } else {
    // Browser globals (root is window)
    root.JSMasker = factory(root)
  }
})(function (polyfills) {
  // Apply polyfills
  if (polyfills && polyfills.applyPolyfills) {
    polyfills.applyPolyfills()
  }

  /**
   * Generates a mask string with a specified length.
   *
   * @param {number|string} maskLength - The length of the mask string. If set to 'random', a random length between `minLength` and `maxLength` will be generated.
   * @param {number} minLength - The minimum length of the mask string.
   * @param {number} maxLength - The maximum length of the mask string.
   * @param {string} [maskChar='*'] - The character used to create the mask string.
   * @returns {string} The generated mask string.
   */
  function generateMask(maskLength, minLength, maxLength, maskChar = '*') {
    let length = maskLength
    if (length === 'random') {
      length =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
    }
    return maskChar.repeat(length)
  }

  /**
   * Normalizes a property name by converting to lowercase and removing special characters
   *
   * @param {string} prop - The property name to normalize
   * @returns {string} - The normalized property name
   */
  function normalizePropertyName(prop) {
    if (typeof prop !== 'string') return prop
    return prop.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  /**
   * Masks sensitive properties in an object or array.
   *
   * @param {Object|Array} data - The object or array to be masked.
   * @param {Object} [config] - The configuration options.
   * @param {string[]} [config.properties=['password', 'key', 'secret', 'token']] - The properties to be masked.
   * @param {number} [config.maskLength=8] - The length of the generated mask.
   * @param {number} [config.minLength=5] - The minimum length of the generated mask.
   * @param {number} [config.maxLength=15] - The maximum length of the generated mask.
   * @param {string} [config.maskChar='*'] - The character used for masking.
   * @param {boolean|string} [config.fullMask=false] - Whether to use a full mask for all properties.
   * @returns {Object|Array} - The masked object or array.
   */
  function maskObject(data, config = {}, seen = new WeakMap()) {
    const {
      properties = [
        'password',
        'key',
        'secret',
        'token',
        'privatekey',
        'passphrase'
      ],
      propertyMatcher = null,
      maskLength = 8,
      minLength = 5,
      maxLength = 15,
      maskChar = '*',
      fullMask = false
    } = config

    if (seen.has(data)) {
      return seen.get(data)
    }

    const normalizedProperties = properties.map(normalizePropertyName)

    function maskValue(value) {
      if (typeof fullMask === 'string') {
        return fullMask
      }
      if (fullMask === true) {
        return maskChar.repeat(value.length)
      }
      return generateMask(maskLength, minLength, maxLength, maskChar)
    }

    function shouldMaskProperty(key, value, path = []) {
      const normalizedKey = normalizePropertyName(key)

      if (propertyMatcher && typeof propertyMatcher === 'function') {
        return propertyMatcher(key, normalizedKey, value, path)
      }

      return normalizedProperties.indexOf(normalizedKey) !== -1
    }

    function processItem(item, isTargetProperty, path = []) {
      if (item == null) {
        return item
      }

      if (typeof item === 'object' && seen.has(item)) {
        return seen.get(item)
      }

      let result
      if (Array.isArray(item)) {
        result = []
        seen.set(item, result)

        for (let i = 0; i < item.length; i += 1) {
          const newPath = [...path, i]
          result[i] = processItem(item[i], isTargetProperty, newPath)
        }
      } else if (typeof item === 'object') {
        result = {}
        seen.set(item, result)

        const keys = Object.keys(item)
        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i]
          const newPath = [...path, key]
          const shouldMask =
            isTargetProperty || shouldMaskProperty(key, item[key], newPath)
          result[key] = processItem(item[key], shouldMask, newPath)
        }
      } else if (isTargetProperty && typeof item === 'string') {
        result = maskValue(item)
      } else {
        result = item
      }

      return result
    }

    let result
    if (Array.isArray(data)) {
      result = []
      seen.set(data, result)

      for (let i = 0; i < data.length; i += 1) {
        result[i] = processItem(data[i], false, [i])
      }
    } else if (data && typeof data === 'object') {
      result = {}
      seen.set(data, result)

      const keys = Object.keys(data)
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        const shouldMask = shouldMaskProperty(key, data[key], [key])
        result[key] = processItem(data[key], shouldMask, [key])
      }
    } else {
      result = data
    }

    return result
  }
  return maskObject
})
