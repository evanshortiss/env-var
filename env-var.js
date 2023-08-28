'use strict'

const variable = require('./lib/variable')
const EnvVarError = require('./lib/env-error')

/**
 * Returns an "env-var" instance that reads from the given container of values.
 * By default, we export an instance that reads from process.env
 * @param  {Object} container target container to read values from
 * @param  {Object} extraAccessors additional accessors to attach to the
 * resulting object
 * @return {Object} a new module instance
 */
const from = (container, extraAccessors, logger) => {
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
     * @return {Object}
     */
    get: function (variableName) {
      if (!variableName) {
        return container
      }

      if (arguments.length > 1) {
        throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
      }

      return variable(container, variableName, extraAccessors || {}, logger || function noopLogger () {})
    },

    /**
     * Provides access to the functions that env-var uses to parse
     * process.env strings into valid types requested by the API
     */
    accessors: require('./lib/accessors/index'),

    /**
     * Provides a default logger that can be used to print logs.
     * This will not print logs in a production environment (checks process.env.NODE_ENV)
     */
    logger: require('./lib/logger')(console.log, container.NODE_ENV)
  }
}

/**
 * Makes a best-effort attempt to load environment variables in
 * different environments, e.g create-react-app, vite, Node.js
 * @returns Object
 */
function getProcessEnv () {
  /* istanbul ignore next */
  try {
    return process.env
  } catch (e) {
    return {}
  }
}

/* istanbul ignore next */
module.exports = from(getProcessEnv())
