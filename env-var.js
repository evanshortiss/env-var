'use strict'

const variable = require('./lib/variable')

/**
 * Returns an "env-var" instance that reads from the given container of values.
 * By default, we export an instance that reads from process.env
 * @param  {Object} container target container to read values from
 * @return {Object} a new module instance
 */
const from = (container) => {
  var _extraAccessors = {}

  return {
    from: from,

    /**
     * This is the Error class used to generate exceptions. Can be used to identify
     * exceptions and handle them appropriatly.
     */
    EnvVarError: require('./lib/env-error'),

    /**
     * Adds a custom accessor to subsequent variables.
     *
     * @param  {String} name Name of the accessor (i.e., function name).
     * @param  {Function} accessor Accessor function.
     */
    addAccessor: (name, accessor) => {
      _extraAccessors[name] = accessor
    },

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

      return variable(container, variableName, defaultValue, _extraAccessors)
    }
  }
}

module.exports = from(process.env)
