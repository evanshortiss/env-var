'use strict'

const asJson = require('./json')

module.exports = function asJsonObject (value) {
  var ret = asJson(value)

  if (Array.isArray(ret)) {
    throw new Error('should be a parseable JSON Object')
  }

  return ret
}
