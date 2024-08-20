/* eslint-disable node/no-unsupported-features/es-builtins */
/* eslint-disable no-extend-native */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */

;(function applyPolyfills() {
  // Only polyfill Object.entries if it doesn't exist
  if (!Object.entries) {
    Object.entries = function (obj) {
      const ownProps = Object.keys(obj)
      return ownProps.map((prop) => [prop, obj[prop]])
    }
  }

  // Polyfill for Array.prototype.includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function (searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined')
        }

        var o = Object(this)
        var len = o.length >>> 0

        if (len === 0) {
          return false
        }

        var n = fromIndex | 0
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

        function sameValueZero(x, y) {
          return (
            x === y ||
            (typeof x === 'number' &&
              typeof y === 'number' &&
              isNaN(x) &&
              isNaN(y))
          )
        }

        while (k < len) {
          if (sameValueZero(o[k], searchElement)) {
            return true
          }
          k++
        }

        return false
      }
    })
  }
})()

// Export the polyfill if we're in a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyPolyfills() {
      // The polyfill is already applied when this file is imported
    }
  }
}
