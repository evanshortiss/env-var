'use strict'

const EnvVarError = require('./env-error')

/**
 * Generate a function to throw an error
 * @param {String} varName
 * @param {String} value
 */
function generateRaiseError (varName, value) {
  return function _raiseError (msg) {
    throw new EnvVarError(`"${varName}" ${msg}, but was "${value}"`)
  }
}

/**
 * Returns an accessor wrapped by error handling and args passing logic
 * @param {Object} container
 * @param {String} varName
 * @param {String} defValue
 * @param {String} accessorPath
 */
function generateAccessor (container, varName, defValue, accessor) {
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

    const args = [
      generateRaiseError(varName, value),
      value
    ].concat(Array.prototype.slice.call(arguments))

    return accessor.apply(
      accessor,
      args
    )
  }
}

/**
 * Returns an Object that contains functions to read and specify the format of
 * the variable you wish to have returned
 * @return {Object}
 */
module.exports = function getVariableAccessors (container, varName, defValue) {
  // Cannot dynamically load accessors if we want to support browsers
  const accessors = {
    asArray: generateAccessor(container, varName, defValue, require('./accessors/array')),

    asBoolStrict: generateAccessor(container, varName, defValue, require('./accessors/bool-strict')),
    asBool: generateAccessor(container, varName, defValue, require('./accessors/bool')),

    asEnum: generateAccessor(container, varName, defValue, require('./accessors/enum')),

    asFloatNegative: generateAccessor(container, varName, defValue, require('./accessors/float-negative')),
    asFloatPositive: generateAccessor(container, varName, defValue, require('./accessors/float-positive')),
    asFloat: generateAccessor(container, varName, defValue, require('./accessors/float')),

    asIntNegative: generateAccessor(container, varName, defValue, require('./accessors/int-negative')),
    asIntPositive: generateAccessor(container, varName, defValue, require('./accessors/int-positive')),
    asInt: generateAccessor(container, varName, defValue, require('./accessors/int')),

    asJsonArray: generateAccessor(container, varName, defValue, require('./accessors/json-array')),
    asJsonObject: generateAccessor(container, varName, defValue, require('./accessors/json-object')),
    asJson: generateAccessor(container, varName, defValue, require('./accessors/json')),

    asString: generateAccessor(container, varName, defValue, require('./accessors/string')),

    asUrlObject: generateAccessor(container, varName, defValue, require('./accessors/url-object')),
    asUrlString: generateAccessor(container, varName, defValue, require('./accessors/url-string')),

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
