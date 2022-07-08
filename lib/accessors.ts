export interface Acccessors<T> {
  asUrlString: (s: string) => string|T
  asUrlObject: (s: string) => URL|T
  asRegExp: (s: string, flags?: string) => RegExp|T
  asPortNumber: (s: string) => number|T
  asInt: (s: string) => number|T
  asIntPositive: (s: string) => number|T
  asIntNegative: (s: string) => number|T
  asFloat: (s: string) => number|T
  asFloatPositive: (s: string) => number|T
  asFloatNegative: (s: string) => number|T
  asJson: (s: string) => Record<string, unknown>|Array<unknown>|T
  asJsonObject: (s: string) => Record<string, unknown>|T
  asJsonArray: (s: string) => Array<unknown>|T
  asBool: (s: string) => boolean|T
  asBoolStrict: (s: string) => boolean|T
  asEnum: (s: string, validValues: readonly string[] | string[]) => string|T
  asArray: (s: string, delimiter: string) => string[]|T
}

export const accessors: Acccessors<never> = {

  asArray (s, delimiter) {
    if (!s.length) {
      return []
    } else {
      return s.split(delimiter).filter(Boolean)
    }
  },

  asEnum(s, validValues) {
    if (validValues.indexOf(s) < 0) {
      throw new Error(`should be one of [${validValues.join(', ')}]`)
    }

    return s
  },

  asBool (s) {
    const val = s.toLowerCase()

      const allowedValues = [
        'false',
        '0',
        'true',
        '1'
      ]

      if (allowedValues.indexOf(val) === -1) {
        throw new Error('should be either "true", "false", "TRUE", "FALSE", 1, or 0')
      }

      return !(((val === '0') || (val === 'false')))
  },

  asBoolStrict (s) {
    const val = s.toLowerCase()

    if ((val !== 'false') && (val !== 'true')) {
      throw new Error('should be either "true", "false", "TRUE", or "FALSE"')
    }

    return val !== 'false'
  },

  asJson: (s) => {
    try {
      const val = JSON.parse(s)

      if (val && (Array.isArray(val) || typeof val === 'object')) {
        // JSON.parse can be passed strings and will attempt to parse them, and
        // even parses the string "null" to the value null. Filter those out...
        return val
      }
    } catch (e) {
      throw new Error('should be valid parseable JSON')
    }
  },

  asJsonObject: (s) => {
    var ret = accessors.asJson(s)

    if (ret === undefined || Array.isArray(ret)) {
      throw new Error('should be a parseable JSON Object')
    }

    return ret
  },

  asJsonArray: (s) => {
    var ret = accessors.asJson(s)

    if (!Array.isArray(ret)) {
      throw new Error('should be a parseable JSON Array')
    }

    return ret
  },

  asFloat: (s) => {
    const n = parseFloat(s)

    if (isNaN(n) || n.toString() !== s) {
      throw new Error('should be a valid float')
    }

    return n
  },

  asFloatPositive: (s) => {
    const ret = accessors.asFloat(s)

    if (ret < 0) {
      throw new Error('should be a positive float')
    }

    return ret
  },

  asFloatNegative: (s) => {
    const ret = accessors.asFloat(s)

    if (ret > 0) {
      throw new Error('should be a negative float')
    }

    return ret
  },


  asInt: (s) => {
    const n = parseInt(s, 10)

    if (isNaN(n) || n.toString(10) !== s) {
      throw new Error('should be a valid integer')
    }

    return n
  },

  asIntNegative: (s) => {
    const ret = accessors.asInt(s)

    if (ret > 0) {
      throw new Error('should be a negative integer')
    }

    return ret
  },

  asIntPositive: (s) => {
    const ret = accessors.asInt(s)

    if (ret < 0) {
      throw new Error('should be a positive integer')
    }

    return ret
  },

  asPortNumber: (s) => {
    var ret = accessors.asIntPositive(s)

    if (ret > 65535) {
      throw new Error('cannot assign a port number greater than 65535')
    }

    return ret
  },

  asUrlString: (s) => {
    return (accessors.asUrlObject(s) as URL).toString()
  },

  asUrlObject: (s) => {
    try {
      return new URL(s)
    } catch (e) {
      throw new Error('should be a valid URL')
    }
  },

  asRegExp: (s, flags) => {
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
  }
}

