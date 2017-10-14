'use strict'

const asFloat = require('./float')

module.exports = function floatNegative (raiseError, value) {
  const ret = asFloat(raiseError, value)

  if (ret > 0) {
    raiseError('should be a negative float')
  }

  return ret
}
