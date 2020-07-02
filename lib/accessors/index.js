module.exports = {
  asArray: require('./array'),

  asBoolStrict: require('./bool-strict'),
  asBool: require('./bool'),

  asPortNumber: require('./port'),
  asEnum: require('./enum'),

  asFloatNegative: require('./float-negative'),
  asFloatPositive: require('./float-positive'),
  asFloat: require('./float'),

  asIntNegative: require('./int-negative'),
  asIntPositive: require('./int-positive'),
  asInt: require('./int'),

  asJsonArray: require('./json-array'),
  asJsonObject: require('./json-object'),
  asJson: require('./json'),

  asRegExp: require('./regexp'),

  asString: require('./string'),

  asUrlObject: require('./url-object'),
  asUrlString: require('./url-string')
}
