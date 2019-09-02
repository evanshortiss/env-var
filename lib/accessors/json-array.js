'use strict'

const asJson = require('./json')

module.exports = function asJsonArray (value) {
  var ret = asJson(value)

  if (!Array.isArray(ret)) {
    throw new Error('should be a parseable JSON Array')
  }

  return ret
}
