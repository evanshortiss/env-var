'use strict'

const asIntPositive = require('./int-positive')

module.exports = function asPortNumber (value) {
  var ret = asIntPositive(value)

  if (ret > 65535) {
    throw new Error('cannot assign a port number greater than 65535')
  }

  return ret
}
