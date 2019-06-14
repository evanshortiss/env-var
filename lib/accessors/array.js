'use strict'

const asString = require('./string')

module.exports = function asArray (raiseError, value, delimeter) {
  delimeter = delimeter || ','

  if (!value.length) {
    return []
  } else {
    return asString(raiseError, value).split(delimeter).filter(Boolean)
  }
}
