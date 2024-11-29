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
  function maskObject(data, config = {}) {
    const {
      properties = ['password', 'key', 'secret', 'token', 'privatekey'],
      maskLength = 8,
      minLength = 5,
      maxLength = 15,
      maskChar = '*',
      fullMask = false
    } = config

    function maskValue(value) {
      if (typeof fullMask === 'string') {
        return fullMask
      }
      if (fullMask === true) {
        return maskChar.repeat(value.length)
      }
      return generateMask(maskLength, minLength, maxLength, maskChar)
    }

    function processItem(item, isTargetProperty) {
      if (Array.isArray(item)) {
        return item.map(function (element) {
          return processItem(element, isTargetProperty)
        })
      }
      if (item && typeof item === 'object') {
        return maskObject(item, {
          properties: isTargetProperty ? [''] : properties,
          maskLength: config.maskLength,
          minLength: config.minLength,
          maxLength: config.maxLength,
          maskChar: config.maskChar,
          fullMask: config.fullMask
        })
      }
      if (isTargetProperty && typeof item === 'string') {
        return maskValue(item)
      }
      return item
    }

    if (Array.isArray(data)) {
      return data.map(function (item) {
        return processItem(item, false)
      })
    }

    if (data && typeof data === 'object') {
      const copy = {}
      Object.keys(data).forEach(function (key) {
        copy[key] = processItem(data[key], properties.indexOf(key) !== -1)
      })
      return copy
    }

    return data
  }

  return maskObject
})
