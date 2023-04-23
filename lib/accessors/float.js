'use strict'

module.exports = function asFloat (value) {
  const n = parseFloat(value)

  // Some values are parsed as valid floats despite being obviously invalid, e.g. "1.o" or "192.168.1.1".
  // In these cases we would want to throw an error.
  if (isNaN(n) || isNaN(value)) {
    throw new Error('should be a valid float')
  }

  return n
}
