'use strict'

const asString = require('./string')

module.exports = function asArray (raiseError, value, delimeter) {
  delimeter = delimeter || ','

  if (!value.length) {
    raiseError(`should include at least one value`)
  }

  return asString(raiseError, value).split(delimeter)
}
