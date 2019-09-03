'use strict'

module.exports = function asInt (value) {
  const n = parseInt(value, 10)

  if (isNaN(n) || value.toString().indexOf('.') !== -1) {
    throw new Error('should be a valid integer')
  }

  return n
}
