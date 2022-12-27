'use strict'

import { EnvVarError } from "./env-error"

export type EnvLogger = (varname: string, msg: string) => void

/**
 * Default logger included with env-var.
 * Will not log anything if is set to production
 */
export function createLogger (out: (s: string) => void, isProduction = true) {
  if (typeof isProduction !== 'boolean') {
    throw new EnvVarError('The second parameter passed to the createLogger function must be a boolean value')
  }
  const envVarLogger: EnvLogger = (varname: string, msg: string) => {
    if (isProduction !== true) {
      out(`env-var (${varname}): ${msg}`)
    }
  }

  return envVarLogger
}
