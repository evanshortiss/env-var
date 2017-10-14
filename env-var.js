'use strict'

const process = require('process')
const variable = require('./lib/variable')

function generateVariableAccessor (container, variableName, defaultValue) {
  if (!variableName) {
    return container
  }

  return variable(container, variableName, defaultValue)
}

/**
 * Returns a variable instance with helper functions, or process.env
 * @param  {String} variableName Name of the environment variable requested
 * @param  {String} defaultValue Optional default to use as the value
 * @return {Object}
 */
exports.get = function (variableName, defaultValue) {
  return generateVariableAccessor(process.env, variableName, defaultValue)
}

/**
 * This is the Error class used to generate exceptions. Can be used to identify
 * exceptions adn handle them appropriatly.
 */
exports.EnvVarError = require('./lib/env-error')

/**
 * Returns a function that acts like env, except instead of looking at
 * process.env, it instead uses the mock values given to it.Useful during
 * testing of your modules.
 * @param  {Object} mockValues mock values to override process.env values
 * @return {Object} This returns a new module instance indistinguishable from the regular one
 */
const mock = exports.mock = (mockValues) => {
  return {
    mock: mock,
    get: (variableName, defaultValue) => {
      return generateVariableAccessor(mockValues, variableName, defaultValue)
    }
  }
}
