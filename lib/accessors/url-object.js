'use strict'

const URL = require('url').URL
const asString = require('./string')

module.exports = function asUrlObject (raiseError, value) {
  const ret = asString(raiseError, value)

  try {
    return new URL(ret)
  } catch (e) {
    raiseError('should be a valid URL')
  }
}
