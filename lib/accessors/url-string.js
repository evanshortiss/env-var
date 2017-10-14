'use strict'

const isUrl = require('is-url')
const asString = require('./string')

module.exports = function (raiseError, value) {
  var ret = asString(raiseError, value)

  if (!isUrl(ret)) {
    raiseError('should be a valid URL')
  }

  return ret
}
