'use strict';

/**
 * This example demonstrates how you can build a custom accessor by composing
 * internal accessors available at env.accessors, and attach it to the env-var
 * instance.
 *
 * Here we use the EnvVarError type to catch an error. If you run the program
 * without setting CATCH_ERROR it will print "we got an env-var error"
 */

const env = require('../env-var');
const { from, accessors } = env;

// Add an accessor named 'asIntRange' which verifies whether the given value is
// between the specified min and max values, inclusive
const envInstance = from(process.env, {
  asIntBetween: (value, min, max) => {
    const ret = accessors.asInt(value);

    if (ret < min || ret > max) {
      throw new Error(
        `should be an integer between the range of [${min}, ${max}]`
      );
    }

    return ret;
  },
});

try {
  // Will throw an error if you have not set this environment variable
  // We specified 'asIntBetween' as the name for the accessor above,
  // so now we can call `asIntBetween()` like any other accessor on all
  // env-var instances.

  // This will pass
  process.env['SERVER_INSTANCES'] = 10;
  let serverInstances = envInstance.get('SERVER_INSTANCES').asIntBetween(1, 10);

  // This will fail
  process.env['SERVER_INSTANCES'] = 0;
  serverInstances = envInstance.get('SERVER_INSTANCES').asIntBetween(1, 10);

  console.log(`SERVER_INSTANCES=${serverInstances}`);
} catch (e) {
  if (e instanceof envInstance.EnvVarError) {
    console.log('We got an env-var error', e);
  } else {
    console.log('Unexpected error', e);
  }
}
