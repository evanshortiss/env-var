'use strict'

/**
 * Custom error class that can be used to identify errors generated
 * by the module
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */
export default class EnvVarError extends Error {
  constructor (message: string) {
    super(`env-var: ${message}`)
    /* istanbul ignore else */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvVarError)
    }

    this.name = 'EnvVarError'
  }
}

module.exports = EnvVarError
