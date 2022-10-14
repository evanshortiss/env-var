'use strict'

/**
 * This example demonstrates logging env-var activity.
 * 
 * Run this script using node example/logging.js
 */

const DEFAULT_ARRAY = JSON.stringify(['luke', 'leia', 'lando', 'chewie'])

// Load the from and logger functions from env-var
const { from } = require('../env-var')

// Create a logger using pino
const log = require('pino')({
  level: 'trace'
})

// Create an env-var instance and pass a logger function
const env = from({
  variables: process.env,
  logger: (varname, message) => log.trace(`${varname}: ${message}`)
})

// Read variables (this will print logs if NODE_ENV isn't "prod" or "production")
const home = env.get('HOME').asString()
const users = env.get('USERNAMES')
  .example(DEFAULT_ARRAY)
  .default(DEFAULT_ARRAY)
  .asJsonArray()

log.info('Fetched HOME value: %j', home)
log.info('Fetched USERNAMES value: %j', users)
