'use strict'

const parseUrl = require('url').parse
const asUrlString = require('./url-string')

module.exports = function asUrlObject (raiseError, value) {
  return parseUrl(asUrlString(raiseError, value))
}
