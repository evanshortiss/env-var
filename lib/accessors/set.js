'use strict'

const asArray = require('./array')

module.exports = function asSet (value, delimiter) {
  if (!value.length) {
    return new Set()
  } else {
    return new Set(asArray(value, delimiter))
  }
}
