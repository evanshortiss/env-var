'use strict'

module.exports = function asBoolStrict (raiseError, value) {
  const val = value.toLowerCase()

  if ((val !== 'false') && (val !== 'true')) {
    raiseError('should be either "true", "false", "TRUE", or "FALSE"')
  }

  return val !== 'false'
}
