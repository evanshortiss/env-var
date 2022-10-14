import { Variable, VariableSource, Extension } from './lib/variable'
import { EnvVarError } from './lib/env-error'
import { accessors } from './lib/accessors'
import { EnvLogger, createLogger } from './lib/logger'
import { isNode } from './lib/check-environment'

export { VariableSource, EnvLogger, EnvVarError, accessors, createLogger,Extension }

export type EnvVarInstanceParams = {
  variables: VariableSource
  requiredByDefault?: false
  logger?: EnvLogger
}

/**
 * Creates an EnvVarInstance with custom variables. Supports parameters that
 * can make all variables required by default, and a logging function.
 * 
 * ```
 * import { from } from 'env-var';
 * 
 * const get = from({
 *   // In a Node.js environment you might simply pass process.env here, but
 *   // in a Next.js or React application you need to explicitly reference the
 *   // variables as shown
 *   variables: {
 *     REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL
 *   },
 * 
 *   // Setting requiredByDefault to true means it's not necessary to call
 *   // required() on all variables. This can be bypassed by calling
 *   // `required(false)` when reading a variable
 *   requiredByDefault: true,
 * 
 *   // Print env-var logs if trace logging is enabled 
 *   logger: (varname, msg) => log.trace(`${varname}: ${msg}`)
 * })
 * 
 * const url = get('BASE_URL).asUrlString()
 * ```
 * 
 * @param {EnvVarInstanceParams} params 
 * @returns {EnvVarInstance}
 */
export function from (params: EnvVarInstanceParams) {
  if (!params || !params.variables) {
    throw new EnvVarError('Since v8.0.0, from() parameters must be an object that contains a "variables" object. The "variables" should be key-value pairs where all values are strings or undefined.')
  }
  
  return new EnvVarInstance(params)
}


/**
 * Read a variable from the environment.
 * 
 * Reads from the global process.env a server-side Node.js environment. All
 * other environments require creating an EnvVarInstance first, i.e: 
 * 
 * ```
 * import { from } from 'env-var';
 * 
 * const get = from({
 *   variables: {
 *     BASE_URL: 'https://foo.bar.com'
 *   }
 * })
 * 
 * const url = get('BASE_URL).asUrlString()
 * ```
 * 
 * @param {String} varname 
 */
export function get (varname?: string) {
  if (!isNode()) {
    throw new EnvVarError('The exported get() function is only supported in Node.js environments. For all other environments use from() to create an EnvVarInstance first.')
  }

  if (arguments.length > 1) {
    throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
  }

  return new EnvVarInstance<unknown>({
    variables: process.env
  }).get(varname)
}

/**
 * An EnvVarInstance is typically created using the `from()` function. This
 * class is exposed for convenience, but isn't recommended for direct use. 
 */
export class EnvVarInstance<VariableSource> {
  constructor (private config: EnvVarInstanceParams) {}

  public get<V extends VariableSource> (): V
  public get (variableName: string): Variable
  public get (variableName?: string): Variable
  public get (variableName?: string) {
    if (!variableName) {
      return this.config.variables
    }

    if (arguments.length > 1) {
      throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
    }

    return new Variable(
      this.config.variables,
      variableName,
      this.config.logger ? this.config.logger : () => {},
      undefined,
      this.config.requiredByDefault
    )
  }
}
