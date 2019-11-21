'use strict'

const EnvVarError = require('./env-error')
const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

/**
 * Returns an Object that contains functions to read and specify the format of
 * the variable you wish to have returned
 * @param  {Object} container Encapsulated container (e.g., `process.env`).
 * @param  {String} varName Name of the requested property from `container`.
 * @param  {*} defValue Default value to return if `varName` is invalid.
 * @param  {Object} extraAccessors Extra accessors to install.
 * @return {Object}
 */
module.exports = function getVariableAccessors (container, varName, defValue, extraAccessors) {
  let isBase64 = false

  /**
   * Throw an error with a consistent type/format.
   * @param {String} value
   */
  function raiseError (value, msg) {
    throw new EnvVarError(`"${varName}" ${msg}, but was "${value}"`)
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
          raiseError(value, 'should be a valid base64 string if using convertFromBase64')
        }

        value = Buffer.from(value, 'base64').toString()
      }

      const args = [value].concat(Array.prototype.slice.call(arguments))

      try {
        return accessor.apply(
          accessor,
          args
        )
      } catch (error) {
        raiseError(value, error.message)
      }
    }
  }

  // Cannot dynamically load accessors if we want to support browsers
  const accessors = {
    asArray: generateAccessor(require('./accessors/array')),

    asBoolStrict: generateAccessor(require('./accessors/bool-strict')),
    asBool: generateAccessor(require('./accessors/bool')),

    asPortNumber: generateAccessor(require('./accessors/port')),
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
     * @param {Boolean} isRequired
     */
    required: function (isRequired) {
      if (isRequired === false) {
        return accessors
      }

      if (typeof container[varName] === 'undefined' && typeof defValue === 'undefined') {
        throw new EnvVarError(`"${varName}" is a required variable, but it was not set`)
      }

      const value = typeof container[varName] === 'undefined' ? defValue : container[varName]
      if (value.trim().length === 0) {
        throw new EnvVarError(`"${varName}" is a required variable, but its value was empty`)
      }

      return accessors
    }
  }

  // Attach extra accessors, if provided.
  Object.entries(extraAccessors).forEach(([name, accessor]) => {
    accessors[name] = generateAccessor(accessor)
  })

  return accessors
}
