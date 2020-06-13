/**
 * This example demonstrates how you can build a custom accessor by composing
 * internal accessors available at env.accessors, and attach it to the env-var
 * instance.
 *
 * Here we use the EnvVarError type to catch an error. If you run the program
 * without setting CATCH_ERROR it will print "we got an env-var error".
 * 
 * To test out this example, run 'tsc custom-accessor-2.ts && node custom-accessor-2.js'.
 * This was named 'custom-accessor-2.ts' to prevent override of the Javascript-equivalent
 * of this example 'custom-accessor.js'.
 */

import * as env from '../env-var'
const { from, accessors } = env

// Add an accessor named 'asIntRange' which verifies whether the given value is
// between the specified min and max values, inclusive
const envInstance = from(process.env, {
  asIntBetween: (value, min, max) => {
    let ret: number, minInt: number, maxInt: number

    try {
      ret = accessors.asInt(value)
      minInt = accessors.asInt(min)
      maxInt = accessors.asInt(max)
    } catch {
      throw new Error('value, min, max must be integers')
    }

    if (ret < minInt || ret > maxInt) {
      throw new Error(
        `should be an integer between the range of [${min}, ${max}]`
      )
    }

    return ret
  }
})

try {
  // Will throw an error if you have not set this environment variable
  // We specified 'asIntBetween' as the name for the accessor above,
  // so now we can call `asIntBetween()` like any other accessor on all
  // env-var instances.

  // This will pass
  process.env.SERVER_INSTANCES = '10'
  let serverInstances = envInstance.get('SERVER_INSTANCES').asIntBetween(1, 10)

  // This will fail because min is not an integer
  process.env['SERVER_INSTANCES'] = '1';
  serverInstances = envInstance.get('SERVER_INSTANCES').asIntBetween('one', 10);

  // This will fail because out of range
  /*process.env.SERVER_INSTANCES = '0'
  serverInstances = envInstance.get('SERVER_INSTANCES').asIntBetween(1, 10)*/

  console.log(`SERVER_INSTANCES=${serverInstances}`)
} catch (e) {
  if (e instanceof env.EnvVarError) {
    console.log('We got an env-var error', e)
  } else {
    console.log('Unexpected error', e)
  }
}
