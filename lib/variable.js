'use strict'

const EnvVarError = require('./env-error')
const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

/**
 * Returns an Object that contains functions to read and specify the format of
 * the variable you wish to have returned
 * @return {Object}
 */
module.exports = function getVariableAccessors (container, varName, defValue) {
  let isBase64 = false

  /**
   * Generate a function to throw an error
   * @param {String} value
   */
  function generateRaiseError (value) {
    return function _raiseError (msg) {
      throw new EnvVarError(`"${varName}" ${msg}, but was "${value}"`)
    }
  }

  /**
   * Returns an accessor wrapped by error handling and args passing logic
   * @param {String} accessorPath
   */
  function generateAccessor (accessor) {
    return function () {
      let value = container[varName]

      if (typeof value === 'undefined') {
        if (typeof defValue === 'undefined') {
          // Need to return since no value is available. If a value needed to
          // be available required() should be called, or a default passed
          return
        }

        // Assign the default as the value since process.env does not contain
        // the desired variable
        value = defValue
      }

      if (isBase64) {
        if (!value.match(base64Regex)) {
          generateRaiseError(value)('should be a valid base64 string if using convertFromBase64')
        }

        value = Buffer.from(value, 'base64').toString()
      }

      const args = [
        generateRaiseError(value),
        value
      ].concat(Array.prototype.slice.call(arguments))

      return accessor.apply(
        accessor,
        args
      )
    }
  }

  // Cannot dynamically load accessors if we want to support browsers
  const accessors = {
    asArray: generateAccessor(require('./accessors/array')),

    asBoolStrict: generateAccessor(require('./accessors/bool-strict')),
    asBool: generateAccessor(require('./accessors/bool')),

    asEnum: generateAccessor(require('./accessors/enum')),

    asFloatNegative: generateAccessor(require('./accessors/float-negative')),
    asFloatPositive: generateAccessor(require('./accessors/float-positive')),
    asFloat: generateAccessor(require('./accessors/float')),

    asIntNegative: generateAccessor(require('./accessors/int-negative')),
    asIntPositive: generateAccessor(require('./accessors/int-positive')),
    asInt: generateAccessor(require('./accessors/int')),

    asJsonArray: generateAccessor(require('./accessors/json-array')),
    asJsonObject: generateAccessor(require('./accessors/json-object')),
    asJson: generateAccessor(require('./accessors/json')),

    asString: generateAccessor(require('./accessors/string')),

    asUrlObject: generateAccessor(require('./accessors/url-object')),
    asUrlString: generateAccessor(require('./accessors/url-string')),

    convertFromBase64: function () {
      isBase64 = true

      return accessors
    },

    /**
     * Ensures a variable is set in the given environment container. Throws an
     * EnvVarError if the variable is not set or a default is not provided
     */
    required: function () {
      if (typeof container[varName] === 'undefined' && typeof defValue === 'undefined') {
        throw new EnvVarError(`"${varName}" is a required variable, but it was not set`)
      }

      return accessors
    }
  }

  return accessors
}
