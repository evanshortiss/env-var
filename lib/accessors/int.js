'use strict'

module.exports = function asInt (value) {
  const n = parseInt(value, 10)

  if (isNaN(n) || n.toString(10) !== value) {
    throw new Error('should be a valid integer')
  }

  return n
}
