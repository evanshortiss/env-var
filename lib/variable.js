'use strict'

const EnvVarError = require('./env-error')
const readdirSync = require('fs').readdirSync
const join = require('path').join
const extname = require('path').extname
const basename = require('path').basename
const camel = require('camelcase')

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
function generateAccessor (container, varName, defValue, accessorPath) {
  let accessor = require(accessorPath)

  return function () {
    let value = container[varName]

    if (typeof value === 'undefined') {
      // Need to simply return since no value is available. If a value needed to
      // be available required() should be called
      return
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
 * Loads any accessor stored in the accessors folder and makes it available via
 * a function attache to the Ojbect returned from this function.
 * @return {Object}
 */
function getAccessors (container, varName, defValue) {
  return readdirSync(join(__dirname, './accessors'))
    .filter((name) => extname(name) === '.js')
    .reduce((data, accessor) => {
      // Create the "asThing" naming convention
      const exportName = camel(`as-${basename(accessor, '.js')}`)

      // Generates the path for requiring the accessor
      const reqPath = join(__dirname, './accessors', accessor)

      return Object.assign(data, {
        [exportName]: generateAccessor(container, varName, defValue, reqPath)
      })
    }, {})
}

/**
 * Returns an Object that contains functions to read and specify the format of
 * the variable you wish to have returned
 * @return {Object}
 */
module.exports = function getVariableAccessors (container, varName, defValue) {
  const accessors = getAccessors(container, varName, defValue)

  /**
   * Ensures a variable is set in the given environment container. Throws an
   * EnvVarError if the variable is not set or a default is not provided
   */
  accessors.required = () => {
    if (typeof container[varName] === 'undefined' && typeof defValue === 'undefined') {
      throw new EnvVarError(`"${varName}" is a required variable, but it was not set`)
    }

    return accessors
  }

  return accessors
}
