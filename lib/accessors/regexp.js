'use strict'

module.exports = function asRegExp (value, flags) {
  // We have to test the value and flags indivudally if we want to write our
  // own error messages,as there is no way to differentiate between the two
  // errors except by using string comparisons.

  // Test the flags
  try {
    RegExp(undefined, flags)
  } catch (err) {
    throw new Error('invalid regexp flags')
  }

  try {
    return new RegExp(value, flags)
  } catch (err) {
    // We know that the regexp is the issue because we tested the flags earlier
    throw new Error('should be a valid regexp')
  }
}
