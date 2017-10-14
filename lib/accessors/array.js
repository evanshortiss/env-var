'use strict'

const asString = require('./string')

module.exports = function asArray (raiseError, value, delimeter) {
  delimeter = delimeter || ','

  return asString(raiseError, value).split(delimeter)
}
