'use strict'

const asInt = require('./int')

module.exports = function intPositive (raiseError, value) {
  const ret = asInt(raiseError, value)

  if (ret < 0) {
    raiseError('should be a positive integer')
  }

  return ret
}
