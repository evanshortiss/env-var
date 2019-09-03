'use strict'

module.exports = function asFloat (value) {
  const n = parseFloat(value)

  if (isNaN(n)) {
    throw new Error('should be a valid float')
  }

  return n
}
