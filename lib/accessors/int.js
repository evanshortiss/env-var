'use strict'

module.exports = function asInt (raiseError, value) {
  const n = parseInt(value, 10)

  if (isNaN(n) || value.toString().indexOf('.') !== -1) {
    raiseError('should be a valid integer')
  }

  return n
}
