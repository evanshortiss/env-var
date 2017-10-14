'use strict'

const asFloat = require('./float')

module.exports = function floatPositive (raiseError, value) {
  const ret = asFloat(raiseError, value)

  if (ret < 0) {
    raiseError('should be a positive float')
  }

  return ret
}
