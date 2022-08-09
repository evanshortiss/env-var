'use strict'

const asString = require('./string')

// eslint-disable-next-line no-control-regex
const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\u0001-\u0008\u000b\u000c\u000e-\u001f\u0021\u0023-\u005b\u005d-\u007f]|\\[\u0001-\u0009\u000b\u000c\u000e-\u007f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\u0008\u000b\u000c\u000e-\u001f\u0021-\u005a\u0053-\u007f]|\\[\u0001-\u0009\u000b\u000c\u000e-\u007f])+)\])$/

module.exports = function asEmailString (value) {
  const strValue = asString(value)

  if (!EMAIL_REGEX.test(strValue)) {
    throw new Error('should be a valid email address')
  }

  return strValue
}
