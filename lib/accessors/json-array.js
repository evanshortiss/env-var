'use strict'

const asJson = require('./json')

module.exports = function asJsonArray (raiseError, value) {
  var ret = asJson(raiseError, value)

  if (!Array.isArray(ret)) {
    raiseError('should be a parseable JSON Array')
  }

  return ret
}
