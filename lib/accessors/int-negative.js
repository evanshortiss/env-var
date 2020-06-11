'use strict'

const asInt = require('./int')

module.exports = function asIntNegative (value) {
  const ret = asInt(value)

  if (ret > 0) {
    throw new Error('should be a negative integer')
  }

  return ret
}
