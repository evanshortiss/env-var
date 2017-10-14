'use strict'

const inherits = require('util').inherits

/**
 * Creates a cutom error class that can be used to identify errors generated
 * by the module
 */
function EnvVarError (message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'EnvVarError'
  this.message = `env-var: ${message}`
};

inherits(EnvVarError, Error)

module.exports = EnvVarError
