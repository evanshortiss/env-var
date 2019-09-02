'use strict'

module.exports = function asBoolStrict (value) {
  const val = value.toLowerCase()

  if ((val !== 'false') && (val !== 'true')) {
    throw new Error('should be either "true", "false", "TRUE", or "FALSE"')
  }

  return val !== 'false'
}
