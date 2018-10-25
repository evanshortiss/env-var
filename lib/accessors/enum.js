'use strict'

const asString = require('./string')

module.exports = function asEnum (raiseError, value, validValues) {
  const valueString = asString(raiseError, value)

  if (validValues.indexOf(valueString) < 0) {
    raiseError(`should be a one of [${validValues.join(', ')}]`)
  }

  return valueString
}
