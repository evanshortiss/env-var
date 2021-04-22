'use strict'

module.exports = function asFloat (value) {
  const n = parseFloat(value)

  if (isNaN(n) || n.toString() !== value) {
    throw new Error('should be a valid float')
  }

  return n
}
