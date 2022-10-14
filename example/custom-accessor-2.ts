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

import { from, Extension } from '../env-var'

// Typically you'd pass process.env instead of a custom object, but using
// a custom object makes this example easier to run and understand
const { get } = from({
  variables: {
    CONCURRENCY: '50'
  }
})

// This is the custom extension. It will verify the value being read is between
// the given min and max values.
const numberBetween: Extension<number, { min: number, max: number }> = (value, error, args) => {
  const num = parseInt(value)
  const { min, max } = args

  if (num <= max && num >= min) {
    return num
  } else {
    // Throw a nicely formatted error message
    throw error(`value ${num} was not between ${min} and ${max}`)
  }
}

// This will return 50, since it satisfies the extension logic
const concurrency = get('CONCURRENCY')
  .required()
  .usingExtension(numberBetween, { min: 25, max: 75 })

console.log('Read concurrency value from env is:', concurrency)

// This will throw an error since the configured CONCURRENCY value of 50 does
// not fall within the given min/max values
const failedConcurrency = get('CONCURRENCY')
  .required()
  .usingExtension(numberBetween, { min: 100, max: 200 })
