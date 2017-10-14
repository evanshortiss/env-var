'use strict'

const asInt = require('./int')

module.exports = function intNegative (raiseError, value) {
  const ret = asInt(raiseError, value)

  if (ret > 0) {
    raiseError('should be a negative integer')
  }

  return ret
}
