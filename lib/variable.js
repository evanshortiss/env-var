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
module.exports = function getVariableAccessors (container, varName, extraAccessors) {
  let isBase64 = false
  let isRequired = false
  let defValue
  let example

  /**
   * Throw an error with a consistent type/format.
   * @param {String} value
   */
  function raiseError (value, msg) {
    let errMsg = `"${varName}" ${msg}`

    if (value) {
      errMsg = `${errMsg}, but is set to "${value}"`
    }

    if (example) {
      errMsg = `${errMsg}. An example of a valid value would be: ${example}`
    }

    throw new EnvVarError(errMsg)
  }

  /**
   * Returns an accessor wrapped by error handling and args passing logic
   * @param {String} accessorPath
   */
  function generateAccessor (accessor) {
    return function () {
      let value = container[varName]

      if (typeof value === 'undefined') {
        if (typeof defValue === 'undefined' && isRequired) {
          // Var is not set, nor is a default. Throw an error
          raiseError(undefined, 'is a required variable, but it was not set')
        } else if (typeof defValue !== 'undefined') {
          value = defValue
        } else {
          // return undefined since variable is not required and
          // there's no default value provided
          return undefined
        }
      }

      if (isRequired) {
        // Need to verify that required variables aren't just whitespace
        if (value.trim().length === 0) {
          raiseError(undefined, 'is a required variable, but its value was empty')
        }
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

    /**
     * Instructs env-var to first convert the value of the variable from base64
     * when reading it using a function such as asString()
     */
    convertFromBase64: function () {
      isBase64 = true

      return accessors
    },

    /**
     * Set a default value for the variable
     * @param {String} value
     */
    default: function (value) {
      if (typeof value === 'number') {
        defValue = value.toString()
      } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        defValue = JSON.stringify(value)
      } else if (typeof value !== 'string') {
        throw new EnvVarError('values passed to default() must be of Number, String, Array, or Object type')
      } else {
        defValue = value
      }

      return accessors
    },

    /**
     * Ensures a variable is set in the given environment container. Throws an
     * EnvVarError if the variable is not set or a default is not provided
     * @param {Boolean} required
     */
    required: function (required) {
      if (typeof required === 'undefined') {
        // If no value is passed assume that developer means "true"
        // This is to retain support legacy usage (and intuitive)
        isRequired = true
      } else {
        isRequired = required
      }

      return accessors
    },

    /**
     * Set an example value for this variable. If the variable value is not set
     * or is set to an invalid value this example will be show in error output.
     * @param {String} example
     */
    example: function (ex) {
      example = ex

      return accessors
    }
  }

  // Attach extra accessors, if provided.
  Object.entries(extraAccessors).forEach(([name, accessor]) => {
    accessors[name] = generateAccessor(accessor)
  })

  return accessors
}
