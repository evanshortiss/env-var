'use strict'

/**
 * This example demonstrates how you can use bluebird's custom catch
 * functionality to respond to different error types.
 *
 * Here we use the EnvVarError type to catch an error. If you run the program
 * without setting CATCH_ERROR it will print "we got an env-var error"
 */

const defaultJsonArray = JSON.stringify(['luke', 'leia', 'lando', 'chewie'])

// Load the from and logger functions from env-var
const { from, logger } = require('../env-var')

// Create an env-var instance and pass it the buitl-in logger
const env = from(process.env, {}, logger)

// Read variables (this will print logs if NODE_ENV isn't "prod" or "production")
const home = env.get('HOME').asString()
const users = env.get('USERNAMES')
  .example(defaultJsonArray)
  .default(defaultJsonArray)
  .asJsonArray()

console.log('\nFetched HOME value:', home)
console.log('Fetched USERNAMES value:', users)
