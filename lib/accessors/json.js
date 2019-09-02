'use strict'

module.exports = function asJson (value) {
  try {
    return JSON.parse(value)
  } catch (e) {
    throw new Error('should be valid (parseable) JSON')
  }
}
