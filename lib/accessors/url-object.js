'use strict'

const asString = require('./string')

module.exports = function asUrlObject (value) {
  const ret = asString(value)

  try {
    return new URL(ret)
  } catch (e) {
    throw new Error('should be a valid URL')
  }
}
