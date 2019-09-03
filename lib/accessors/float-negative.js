'use strict'

const asFloat = require('./float')

module.exports = function floatNegative (value) {
  const ret = asFloat(value)

  if (ret > 0) {
    throw new Error('should be a negative float')
  }

  return ret
}
