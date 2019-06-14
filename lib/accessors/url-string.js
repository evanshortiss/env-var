'use strict'

const urlObject = require('./url-object')

module.exports = function (raiseError, value) {
  return urlObject(raiseError, value).toString()
}
