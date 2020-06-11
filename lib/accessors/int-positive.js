'use strict'

const asInt = require('./int')

module.exports = function asIntPositive (value) {
  const ret = asInt(value)

  if (ret < 0) {
    throw new Error('should be a positive integer')
  }

  return ret
}
