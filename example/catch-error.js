'use strict'

/**
 * This example demonstrates how you can use bluebird's custom catch
 * functionality to respond to different error types.
 *
 * Here we use the EnvVarError type to catch an error. If you run the program
 * without setting CATCH_ERROR it will print "we got an env-var error"
 */

const env = require('../env-var')

try {
  // will throw if you have not set this variable
  env.get('CATCH_ERROR').required().asString()

  // If catch error is set, we'll end up throwing here instead
  throw new Error('some other error')
} catch (e) {
  if (e instanceof env.EnvVarError) {
    console.log('we got an env-var error', e)
  } else {
    console.log('we got some error that wasn\'t an env-var error', e)
  }
}
