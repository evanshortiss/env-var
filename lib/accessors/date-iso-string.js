'use strict'

const asString = require('./string')
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

module.exports = function asDateISOString (value) {
  const strValue = asString(value)

  if (DATE_ONLY_REGEX.test(strValue)) {
    const date = new Date(`${strValue}T00:00:00.000Z`)

    if (date.toISOString().startsWith(strValue)) {
      return strValue
    }
  }

  try {
    const date = new Date(strValue)

    // Date parses more formats than ISO 8601, so require the canonical output
    // of Date#toISOString rather than accepting every parseable date string.
    if (date.toISOString() !== strValue) {
      throw new Error()
    }
  } catch (e) {
    throw new Error('should be a valid date ISO string')
  }

  return strValue
}
