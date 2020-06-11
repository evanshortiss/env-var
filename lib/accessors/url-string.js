'use strict'

const urlObject = require('./url-object')

module.exports = function asUrlString (value) {
  return urlObject(value).toString()
}
