'use strict'

const asString = require('./string')

module.exports = function asEnum (value, validValues) {
  const valueString = asString(value)

  if (validValues.indexOf(valueString) < 0) {
    throw new Error(`should be one of [${validValues.join(', ')}]`)
  }

  return valueString
}
