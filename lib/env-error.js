'use strict'

/**
 * Custom error class that can be used to identify errors generated
 * by the module
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */
class EnvVarError extends Error {
  constructor (message, ...params) {
    super(`env-var: ${message}`, ...params)
/* istanbul ignore else */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvVarError)
    }

    this.name = 'EnvVarError'
  }
}

module.exports = EnvVarError
