'use strict'

const asFloat = require('./float')

module.exports = function asFloatPositive (value) {
  const ret = asFloat(value)

  if (ret < 0) {
    throw new Error('should be a positive float')
  }

  return ret
}
