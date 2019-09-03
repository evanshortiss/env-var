'use strict'

const asString = require('./string')

module.exports = function asArray (value, delimiter) {
  delimiter = delimiter || ','

  if (!value.length) {
    return []
  } else {
    return asString(value).split(delimiter).filter(Boolean)
  }
}
