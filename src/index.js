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
   * Masks sensitive properties in an object.
   *
   * @param {Object} obj - The object to be masked.
   * @param {Object} [config] - The configuration options.
   * @param {string[]} [config.properties=['password', 'key', 'secret', 'token']] - The properties to be masked.
   * @param {number} [config.maskLength=8] - The length of the generated mask.
   * @param {number} [config.minLength=5] - The minimum length of the generated mask.
   * @param {number} [config.maxLength=15] - The maximum length of the generated mask.
   * @param {string} [config.maskChar='*'] - The character used for masking.
   * @param {boolean} [config.fullMask=false] - Whether to use a full mask for all properties.
   * @returns {Object} - The masked object.
   */
  function maskObject(obj, config = {}) {
    const {
      properties = ['password', 'key', 'secret', 'token'],
      maskLength = 8,
      minLength = 5,
      maxLength = 15,
      maskChar = '*',
      fullMask = false
    } = config

    // Ensure the input is an object
    if (obj && typeof obj === 'object') {
      // eslint-disable-next-line prefer-object-spread
      const copy = Array.isArray(obj) ? [] : Object.assign({}, obj)

      Object.keys(copy).forEach((key) => {
        const value = copy[key]
        if (properties.includes(key) && typeof value === 'string') {
          if (typeof fullMask === 'string') {
            copy[key] = fullMask
          } else if (fullMask === true) {
            copy[key] = maskChar.repeat(value.length)
          } else {
            // Default behavior: use fixed or random length mask
            copy[key] = generateMask(maskLength, minLength, maxLength, maskChar)
          }
        } else if (typeof value === 'object') {
          copy[key] = maskObject(value, config)
        }
      })

      return copy
    }

    // If obj is not an object, return it unchanged
    return obj
  }

  return maskObject
})
