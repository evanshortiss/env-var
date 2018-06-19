'use strict'

const asString = require('./string')

module.exports = function asEnum (raiseError, value, validValues) {
  const valueString = asString(raiseError, value);

  if (!validValues.includes(valueString)) {
    raiseError(`should be a one of [${validValues.join(', ')}]`)
  }

  return valueString
}
