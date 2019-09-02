'use strict'

const variable = require('./lib/variable')

/**
 * Returns an "env-var" instance that reads from the given container of values.
 * By default, we export an instance that reads from process.env
 * @param  {Object} container target container to read values from
 * @param  {Object} extraAccessors additional accessors to attach to the
 * resulting object
 * @return {Object} a new module instance
 */
const from = (container, extraAccessors) => {
  return {
    from: from,

    /**
     * This is the Error class used to generate exceptions. Can be used to identify
     * exceptions and handle them appropriately.
     */
    EnvVarError: require('./lib/env-error'),

    /**
     * Returns a variable instance with helper functions, or process.env
     * @param  {String} variableName Name of the environment variable requested
     * @param  {String} defaultValue Optional default to use as the value
     * @return {Object}
     */
    get: (variableName, defaultValue) => {
      if (!variableName) {
        return container
      }

      return variable(container, variableName, defaultValue, extraAccessors || {})
    }
  }
}

module.exports = from(process.env)
