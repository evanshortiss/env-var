'use strict'

import { accessors } from './accessors'
import { EnvVarError } from './env-error'
import { EnvLogger } from './logger'
const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

export type VariableSource = Record<string, string|undefined>
export type Extension<ReturnType> = (v: string, error: (s: string) => EnvVarError) => ReturnType

export class Variable<T = undefined> {
  constructor(
    protected container: VariableSource,
    protected varName: string,
    protected logger: EnvLogger,
    protected isBase64?: boolean,
    protected isRequired?: boolean,
    protected defValue?: string,
    protected exampleValue?: string,
    protected descriptionValue?: string
  ) {}

  /**
   * Logs the given string using the provided logger
   * @param {String} str
   * @param {String} str
   */
   protected log(str: string) {
    this.logger(this.varName, str)
  }

  /**
   * Instructs env-var to first convert the value of the variable from base64
   * when reading it using a function such as asString()
   */
  public convertFromBase64() {
    this.log('marking for base64 conversion')
    this.isBase64 = true

    return this
  }

  /**
   * Set a default value for the variable
   * @param {String} value
   */
  public default(value: string | number | unknown) {
    if (typeof value === 'number') {
      this.defValue = value.toString()
    } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      this.defValue = JSON.stringify(value)
    } else if (typeof value !== 'string') {
      throw new EnvVarError('values passed to default() must be of Number, String, Array, or Object type')
    } else {
      this.defValue = value
    }

    this.log(`setting default value to "${this.defValue}"`)

    return this
  }

  /**
   * Set an example value for this variable. If the variable value is not set
   * or is set to an invalid value this example will be show in error output.
   * @param {String} example
   */
   public example(ex: string) {
    this.exampleValue = ex

    return this
  }

  public description (description: string) {
    this.descriptionValue = description

    return this
  }

  /**
   * Throw an error with a consistent type/format.
   * @param {String} value
   */
  protected createError(msg: string): EnvVarError {
    let errMsg = `"${this.varName}" ${msg}`

    if (this.descriptionValue) {
      errMsg = `${errMsg}. ${this.descriptionValue}`
    }

    if (this.exampleValue) {
      errMsg = `${errMsg}. An example of a valid value would be: ${this.exampleValue}`
    }

    return new EnvVarError(errMsg)
  }

  protected getValue<V>(parser: (value: string) => V): V|T {
    let value = this.container[this.varName]
    const { defValue } = this

    this.log(`will be read from the environment`)

    if (typeof value === 'undefined') {
      if (typeof defValue === 'undefined' && this.isRequired) {
        this.log('was not found in the environment, but is required to be set')
        // Var is not set, nor is a default. Throw an error
        throw this.createError('is a required variable, but it was not set')
      } else if (typeof defValue !== 'undefined') {
        this.log(`was not found in the environment, parsing default value "${defValue}" instead`)
        value = defValue
      } else {
        this.log('was not found in the environment, but is not required. returning undefined')
        // return undefined since variable is not required and
        // there's no default value provided
        return undefined!
      }
    }

    if (this.isRequired) {
      this.log('verifying variable value is not an empty string')
      // Need to verify that required variables aren't just whitespace
      if (value.trim().length === 0) {
        throw this.createError('is a required variable, but its value was empty')
      }
    }

    if (this.isBase64) {
      this.log('verifying variable is a valid base64 string')
      if (!value.match(base64Regex)) {
        throw this.createError('should be a valid base64 string if using convertFromBase64')
      }
      this.log('converting from base64 to utf8 string')
      value = Buffer.from(value, 'base64').toString()
    }

    try {
      return parser(value)
    } catch (e) {
      throw this.createError((e as Error).message)
    }
  }

  public usingExtension<ReturnType> (ext: Extension<ReturnType>) {
    const value = this.asString()

    if (typeof value === 'string') {
      return ext(value, (s: string) => { throw this.createError(s) })
    } else {
      return value
    }
  }

  /**
   * Ensures a variable is set in the given environment container. Throws an
   * EnvVarError if the variable is not set or a default is not provided
   * @param {Boolean} required
   */
   public required(required?: boolean): Variable<never>
   public required(required: true): Variable<never>
   public required(required: false): Variable<undefined>
   public required(required?: boolean): Variable<never>|Variable<undefined> {
     if (required || required === undefined) {
       this.isRequired = true
       return this as unknown as Variable<never>
     } else {
       this.isRequired = false
       return this as unknown as Variable<undefined>
     }
   }

  public asString() {
    return this.getValue<string>((s) => s)
  }

  public asArray(delimiter = ',') {
    return this.getValue(s => accessors.asArray(s, delimiter))
  }

  public asBoolStrict() {
    return this.getValue(accessors.asBoolStrict)
  }

  public asBool() {
    return this.getValue(accessors.asBool)
  }

  public asEnum (validValues: readonly string[] | string[]) {
    return this.getValue(s => accessors.asEnum(s, validValues))
  }

  public asFloat() {
    return this.getValue(s => accessors.asFloat(s))
  }

  public asFloatNegative() {
    return this.getValue(accessors.asFloatNegative)
  }

  public asFloatPositive() {
    return this.getValue(accessors.asFloatPositive)
  }

  public asInt() {
    return this.getValue(accessors.asInt)
  }

  public asIntNegative() {
    return this.getValue(accessors.asIntNegative)
  }

  public asIntPositive() {
    return this.getValue(accessors.asIntPositive)
  }

  public asJson() {
    return this.getValue(s => accessors.asJson(s))
  }

  public asJsonArray() {
    return this.getValue(accessors.asJsonArray)
  }

  public asJsonObject() {
    return this.getValue(accessors.asJsonObject)
  }

  public asPortNumber() {
    return this.getValue(accessors.asPortNumber)
  }

  public asRegExp(flags?: string) {
    return this.getValue(s => accessors.asRegExp(s, flags))
  }

  public asUrlObject() {
    return this.getValue(accessors.asUrlObject)
  }

  public asUrlString() {
    return this.getValue(accessors.asUrlString)
  }
}
