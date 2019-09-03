'use strict'

const urlObject = require('./url-object')

module.exports = function (value) {
  return urlObject(value).toString()
}
