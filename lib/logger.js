'use strict'

/**
 * Default logger included with env-var.
 * Will not log anything if NODE_ENV is set to production
 */
module.exports = function genLogger (out, prodFlag) {
  return function envVarLogger (varname, str) {
    if (!prodFlag || !prodFlag.match(/prod|production/)) {
      out(`env-var (${varname}): ${str}`)
    }
  }
}
