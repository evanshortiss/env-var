'use strict'

module.exports = function asBool (value) {
  const val = value.toLowerCase()

  const allowedValues = [
    'false',
    '0',
    'true',
    '1'
  ]

  if (allowedValues.indexOf(val) === -1) {
    throw new Error('should be either "true", "false", "TRUE", "FALSE", 1, or 0')
  }

  return !(((val === '0') || (val === 'false')))
}
