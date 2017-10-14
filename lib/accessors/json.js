'use strict'

module.exports = function asJson (raiseError, value) {
  try {
    return JSON.parse(value)
  } catch (e) {
    raiseError('should be valid (parseable) JSON')
  }
}
