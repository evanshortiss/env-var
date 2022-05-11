'use strict'

import EnvVarError from './env-error'
import { EnvContainer, EnvLogger } from './types'
const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

type ValueProvider = () => string
export type Extension<T> = (v: string, error: (s: string) => EnvVarError) => T

// const asArray: Accessor<{ delim: string }, string[]> = (vp) => {
//   return (args) => {
//     return vp().split(args.delim)
//   }
// }

// export function getVariable(
//   container: EnvContainer,
//   varName: string,
//   logger: EnvLogger,
//   isBase64?: boolean,
//   isRequired?: boolean,
//   defValue?: string,
//   exampleValue?: string,
//   accessors: Accessors
// ) {

//   const v = {
//     getParsedValue(): string|undefined {
//       let value = container[varName]

//       log(`will be read from the environment`)

//       if (typeof value === 'undefined') {
//         if (typeof defValue === 'undefined' && isRequired) {
//           log('was not found in the environment, but is required to be set')
//           // Var is not set, nor is a default. Throw an error
//           throw createError('is a required variable, but it was not set')
//         } else if (typeof defValue !== 'undefined') {
//           log(`was not found in the environment, parsing default value "${defValue}" instead`)
//           value = defValue
//         } else {
//           log('was not found in the environment, but is not required. returning undefined')
//           // return undefined since variable is not required and
//           // there's no default value provided
//           return undefined!
//         }
//       }

//       if (value && isRequired) {
//         log('verifying variable value is not an empty string')
//         // Need to verify that required variables aren't just whitespace
//         if (value.trim().length === 0) {
//           throw createError('is a required variable, but its value was empty')
//         }
//       }

//       if (value && isBase64) {
//         log('verifying variable is a valid base64 string')
//         if (!value.match(base64Regex)) {
//           throw createError('should be a valid base64 string if using convertFromBase64')
//         }
//         log('converting from base64 to utf8 string')
//         value = Buffer.from(value, 'base64').toString()
//       }
//       if (value) return value
//       return undefined!
//     },

//     /**
//      * Instructs env-var to first convert the value of the variable from base64
//      * when reading it using a function such as asString()
//      */
//     convertFromBase64() {
//       log('marking for base64 conversion')
//       isBase64 = true

//       return v
//     },

//     /**
//    * Set a default value for the variable
//    * @param {String} value
//    */
//     default(value: string | number | unknown) {
//       if (typeof value === 'number') {
//         defValue = value.toString()
//       } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
//         defValue = JSON.stringify(value)
//       } else if (typeof value !== 'string') {
//         throw new EnvVarError('values passed to default() must be of Number, String, Array, or Object type')
//       } else {
//         defValue = value
//       }

//       log(`setting default value to "${defValue}"`)

//       return v
//     },

//     required () {
//       isRequired = true

//       return {
//         ...v,
//         asArray: requiredProtec(asArray)
//       }
//     }
//   }

//   function log(str: string) {
//     logger(varName, str)
//   }

//   function createError(msg: string): EnvVarError {
//     let errMsg = `"${varName}" ${msg}`

//     if (exampleValue) {
//       errMsg = `${errMsg}. An example of a valid value would be: ${exampleValue}`
//     }

//     return new EnvVarError(errMsg)
//   }

//   function protec <T extends Accessor<any, any>>(a: T): ReturnType<T>|(() => undefined) {
//     return <any>function(...args: []) {
//       const val = v.getParsedValue()

//       return a(() => val as string)(args)
//     }
//   }

//   function requiredProtec <T extends Accessor<any, any>>(a: T): ReturnType<T> {
//     return <any>function(...args: []) {
//       const val = v.getParsedValue()

//       return a(() => val as string)(args)
//     }
//   }

//   // const a = protec(asArray)
//   // const b = requiredProtec(asArray)
//   // const reta = a({ delim: '.' })
//   // const retb = b({ delim: '.' })
//   Object.keys(accessors).reduce((fns, cur) => {
//     const f = accessors[cur]
//     fns[cur] = protec(accessors[cur])
//     return fns
//   }, {})
//   return {
//     ...v,
//     asArray: protec(asArray)
//   }
// }

// const ee = getVariable(
//   process.env, 'pl', logger(console.log, '')
// )

// const ov = ee.asArray({ delim: '.' })
// const pv = ee.required().asArray({ delim: ',' })

export class Variable<T = undefined> {
  constructor(
    protected container: EnvContainer,
    protected varName: string,
    protected logger: EnvLogger,
    protected isBase64?: boolean,
    protected isRequired?: boolean,
    protected defValue?: string,
    protected exampleValue?: string
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

  /**
   * Throw an error with a consistent type/format.
   * @param {String} value
   */
  protected createError(msg: string): EnvVarError {
    let errMsg = `"${this.varName}" ${msg}`

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

    if (value && this.isRequired) {
      this.log('verifying variable value is not an empty string')
      // Need to verify that required variables aren't just whitespace
      if (value.trim().length === 0) {
        throw this.createError('is a required variable, but its value was empty')
      }
    }

    if (value && this.isBase64) {
      this.log('verifying variable is a valid base64 string')
      if (!value.match(base64Regex)) {
        throw this.createError('should be a valid base64 string if using convertFromBase64')
      }
      this.log('converting from base64 to utf8 string')
      value = Buffer.from(value, 'base64').toString()
    }

    if (value) {
      return parser(value)
    }

    return undefined!
  }

  public asString() {
    return this.getValue<string>((s) => s)
  }

  public asArray(delimiter: string) {
    return this.getValue<string[]>((s) => {
      delimiter = delimiter || ','

      if (!s.length) {
        return []
      } else {
        return s.split(delimiter).filter(Boolean)
      }
    })
  }

  public asBoolStrict() {
    return this.getValue<boolean>((s) => {
      const val = s.toLowerCase()

      if ((val !== 'false') && (val !== 'true')) {
        throw this.createError('should be either "true", "false", "TRUE", or "FALSE"')
      }

      return val !== 'false'
    })
  }

  public asBool() {
    return this.getValue((s) => {
      const val = s.toLowerCase()

      const allowedValues = [
        'false',
        '0',
        'true',
        '1'
      ]

      if (allowedValues.indexOf(val) === -1) {
        throw this.createError('should be either "true", "false", "TRUE", "FALSE", 1, or 0')
      }

      return !(((val === '0') || (val === 'false')))
    })
  }

  public asEnum(validValues: readonly string[] | string[]) {
    return this.getValue<string>((s) =>  {
      if (validValues.indexOf(s) < 0) {
        throw this.createError(`should be one of [${validValues.join(', ')}]`)
      }

      return s
    })
  }

  public asFloat() {
    return this.getValue<number>((s) =>  {
      const n = parseFloat(s)

      if (isNaN(n) || n.toString() !== s) {
        throw this.createError('should be a valid float')
      }

      return n
    })
  }

  public asFloatNegative() {
    const ret = this.asFloat()

    if (ret > 0) {
      throw this.createError('should be a negative float')
    }

    return ret
  }

  public asFloatPositive() {
    const ret = this.asFloat()

    if (ret < 0) {
      throw this.createError('should be a positive float')
    }

    return ret
  }

  public asInt() {
    return this.getValue<number>((s) => {
      const n = parseInt(s, 10)

      if (isNaN(n) || n.toString(10) !== s) {
        throw this.createError('should be a valid integer')
      }

      return n
    })
  }

  public asIntNegative() {
    const ret = this.asInt()

    if (ret > 0) {
      throw this.createError('should be a negative integer')
    }

    return ret
  }

  public asIntPositive() {
    const ret = this.asInt()

    if (ret < 0) {
      throw this.createError('should be a positive integer')
    }

    return ret
  }

  public asJson() {
    try {
      return this.getValue<Record<string, unknown> | Array<unknown>>((s) => {
        const val = JSON.parse(s)

        if (val && (Array.isArray(val) || typeof val === 'object')) {
          // JSON.parse can be passed strings and will attempt to parse them, and
          // even parses the string "null" to the value null. Filter those out...
          return val
        }
      })
    } catch (e) {
      throw this.createError('should be valid parseable JSON')
    }
  }

  public asJsonArray(): Array<unknown> {
    var ret = this.asJson()

    if (!Array.isArray(ret)) {
      throw new Error('should be a parseable JSON Array')
    }

    return ret
  }

  public asJsonObject() {
    var ret = this.asJson()

    if (ret === undefined || Array.isArray(ret)) {
      throw new Error('should be a parseable JSON Object')
    }

    return ret
  }


  public asPortNumber() {
    var ret = this.asIntPositive()

    if (ret > 65535) {
      throw new Error('cannot assign a port number greater than 65535')
    }

    return ret
  }

  public asRegExp(flags?: string) {
    return this.getValue<RegExp>((s) => {
      // We have to test the value and flags indivudally if we want to write our
      // own error messages,as there is no way to differentiate between the two
      // errors except by using string comparisons.

      // Test the flags
      try {
        RegExp('', flags)
      } catch (err) {
        throw new Error('invalid regexp flags')
      }

      try {
        return new RegExp(s, flags)
      } catch (err) {
        // We know that the regexp is the issue because we tested the flags earlier
        throw new Error('should be a valid regexp')
      }
    })
  }

  public asUrlObject() {
    return this.getValue<URL>((s) => {
      try {
        return new URL(s)
      } catch (e) {
        throw new Error('should be a valid URL')
      }
    })
  }

  public asUrlString() {
    return (this.asUrlObject() as URL).toString()
  }

  public usingExtension<RV> (e: Extension<RV>) {
    const value = this.asString()

    if (typeof value === 'string') {
      return e(value, (s: string) => this.createError(s))
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
}
