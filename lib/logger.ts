'use strict'

import { EnvLogger } from './types'

/**
 * Default logger included with env-var.
 * Will not log anything if NODE_ENV is set to production
 */
export default function genLogger (out: (s: string) => void, prodFlag?: string) {
  const envVarLogger: EnvLogger = (varname: string, msg: string) => {
    if (!prodFlag || !prodFlag.match(/prod|production/)) {
      out(`env-var (${varname}): ${msg}`)
    }
  }

  return envVarLogger
}
