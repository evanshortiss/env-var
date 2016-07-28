'use strict';


module.exports = function (name, value) {
  var VError = require('verror');

  return {
    isInt: function isInt (n) {
      if (isNaN(n) || n.toString().indexOf('.') !== -1) {
        throw new VError(
          'env-var: %s should be a valid integer, but was %s',
          name,
          value
        );
      }

      return n;
    },

    isFloat: function isFloat (n) {
      if (isNaN(n)) {
        throw new VError(
          'env-var: %s should be a valid float, but was %s',
          name,
          value
        );
      }

      return n;
    },

    isBool: function isBool (val) {
      val = val.toLowerCase();

      if (val !== 'false' && val !== 'true') {
        throw new Error(
          'env-var: "%s" should be either "true" or "false", but was %s',
          name,
          value
        );
      }

      return Boolean(val);
    }
  };
};
