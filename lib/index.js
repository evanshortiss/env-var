'use strict';

/**
 * Returns a variable instance with helper functions, or process.env
 * @param  {String} vname Name of the environment variable requested
 * @param  {String} def   Optional default to use as the value
 * @return {Object}
 */
module.exports = function(vname, def) {
  return get(process.env, vname, def);
};

/**
 * Returns a function that acts like env, except instead of looking at
 * process.env, it instead uses the mock values given to it. Useful during
 * testing of your modules.
 * @param  {Object} mockValues mock values to simulate process.env values
 * @return {Function} A function that acts the same as module.exports.
 */
module.exports.mock = function(mockValues) {
  return function(vname, def) {
    return get(mockValues, vname, def);
  }
};

/**
 * Returns a variable instance with helper functions, or process.env
 * @param  {Object} lookup  Object that holds the values of the variables
 * @param  {String} vname Name of the environment variable requested
 * @param  {String} def   Optional default to use as the value
 * @return {Object}
 */
function get(lookup, vname, def) {
  if (typeof vname === 'string') {
    return require('./variable')(
      vname,
      (lookup[vname] !== undefined) ? lookup[vname] : def
    );
  } else {
    return lookup;
  }
};
