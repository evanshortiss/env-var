'use strict';

/**
 * Returns a variable instance with helper functions, or process.env
 * @param  {String} vname Name of the environment variable requested
 * @param  {String} def   Optional default to use as the value
 * @return {Object}
 */
module.exports = function (vname, def) {
  if (typeof vname === 'string') {
    return require('./variable')(
      vname,
      (process.env[vname] !== undefined) ? process.env[vname] : def
    );
  } else {
    return process.env;
  }
};
