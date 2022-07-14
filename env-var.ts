import { Variable, VariableSource } from './lib/variable'
import { EnvVarError } from './lib/env-error'
import { accessors } from './lib/accessors'
import { EnvLogger, createLogger } from './lib/logger'

export { Variable, VariableSource, EnvLogger, EnvVarError, accessors, createLogger }

export type EnvVarInstanceParams = {
  variableContainer: VariableSource
  requiredByDefault?: false
  logger?: EnvLogger
}

export function from (params: EnvVarInstanceParams) {
  if (!params.variableContainer) {
    throw new EnvVarError('Since v8.0.0, from() parameters must be an object that contains a "variableContainer" property that contains all environment variables.')
  }
  
  return new EnvVarInstance(params)
}

export function get <VariableSource>(varname?: string): Variable|VariableSource {
  if (typeof process === 'undefined') {
    throw new EnvVarError('The exported get() function is only supported in Node.js environments. For all other environments use from() to create an EnvVarInstance first.')
  }

  if (arguments.length > 1) {
    throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
  }

  return new EnvVarInstance({
    variableContainer: process.env
  }).get(varname)
}

export class EnvVarInstance<VariableSource> {
  constructor (private config: EnvVarInstanceParams) {}

  public get<V extends VariableSource> (): V
  public get (variableName: string): Variable
  public get (variableName?: string): Variable
  public get (variableName?: string) {
    if (!variableName) {
      return this.config.variableContainer
    }

    if (arguments.length > 1) {
      throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
    }

    return new Variable(
      this.config.variableContainer,
      variableName,
      this.config.logger ? this.config.logger : () => {},
      undefined,
      this.config.requiredByDefault
    )
  }
}
