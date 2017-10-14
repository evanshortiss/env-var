'use strict'

module.exports = function asFloat (raiseError, value) {
  const n = parseFloat(value)

  if (isNaN(n)) {
    raiseError('should be a valid float')
  }

  return n
}
