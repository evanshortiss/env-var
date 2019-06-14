'use strict'

const asString = require('./string')

module.exports = function asArray (raiseError, value, delimiter) {
  delimiter = delimiter || ','

  if (!value.length) {
    return []
  } else {
    return asString(raiseError, value).split(delimiter).filter(Boolean)
  }
}
