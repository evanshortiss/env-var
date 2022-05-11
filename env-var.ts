'use strict'

import { Extension, Variable } from './lib/variable'
import EnvVarError from './lib/env-error'
import genLogger from './lib/logger'
import { EnvLogger } from './lib/types'

const container = process.env
const logger = genLogger(console.log, container.NODE_ENV)



export type ExtensionFn<T> = (value: string, ...args: any[]) => T
export type Extensions = {
  [key: string]: ExtensionFn<any>
}
export { Variable, logger }

export type EnvVarConfig<Container extends NodeJS.ProcessEnv = NodeJS.ProcessEnv> = {
  container: Container
  // variableClass?: { new(...args: any[]): ExtendedVariable },
  logger?: EnvLogger
}

export function get (): NodeJS.ProcessEnv
export function get (variableName: string): Variable
export function get (variableName?: string) {
  if (!variableName) {
    return container
  }

  if (arguments.length > 1) {
    throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
  }

  return new Variable(container, variableName, function noopLogger () {})
}

export class EnvInstance {
  constructor (private config: EnvVarConfig) {}

  public get (): NodeJS.ProcessEnv
  public get<V extends Variable> (variableName: string): V
  public get (variableName?: string) {
    if (!variableName) {
      return this.config.container
    }

    if (arguments.length > 1) {
      throw new EnvVarError('It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
    }

    return new Variable(this.config.container, variableName, function noopLogger () {})
  }
}

const asEmail: Extension<string> = (s, error) => {
  if (s.includes('@')) {
    return s
  } else {
    throw error('must be a string')
  }
}

const asObject: Extension<Record<string, unknown>> = (s, error) => {
  return JSON.parse(s)
}
const instance = new EnvInstance({
  container: process.env
})

const raw = instance.get('OK')
const v: string = instance.get('OK').required().usingExtension(asEmail)
const obj = instance.get('OK').usingExtension(asObject)
const port: number = instance.get('OK').required().asPortNumber()
