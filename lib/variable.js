'use strict';

var VError = require('verror');

module.exports = function environmentVariable (name, value) {

  var types = require('./type-checks')(name, value);

  var varWrapper = {
    required: function required () {
      if (!value) {
        // Value is not set, but is required. Throw an error
        throw new VError('env-var: "%s" is required, but was not set', name);
      }

      return varWrapper;
    },
    asInt: function asInt(radix) {
      return types.isInt(
        parseInt(value, radix || 10)
      );
    },
    asFloat: function asFloat() {
      return types.isFloat(
        parseFloat(value)
      );
    },
    asString: function asString () {
      return value;
    },
    asBool: function asBool () {
      return types.isBool(value);
    },
    asJson: function asJson () {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new VError('env-var: failed to parse "%s" to a JSON Object');
      }
    }
  };

  return varWrapper;
};
