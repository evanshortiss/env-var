# env-var examples

For more examples, refer to the `/example` directory.

### Directory

* [Logging](#logging)
* [Dotenv](#dotenv)
* [Next.js](#nextjs)
* [React](#react)
* [Vite](#vite)
* [Other examples](#other-examples)

## Logging

Logging is disabled by default in env-var. This prevents accidental logging of
potentially sensitive values.

To enable logging, create an env-var instance using the `from()` function,
and pass the `logger` parameter. The `logger` parameter is a function that
should accept two string arguments. 

Exercise caution with logging related to environment variables and use a logger
with configurable log levels.

Here's an example using [pino](https://www.npmjs.com/package/pino):

```js
const { from } = require('env-var')

// Create a pino instance. Default to "info" log level
const log = require('pino')({
  level: process.env.LOG_LEVEL || 'trace'
})

/**
 * Custom logging function for env-var
 * @param {String} varname The name of the variable, e.g "API_KEY"
 * @param {String} message The log message text
 */
const logger = (varname, message) => {
  log.trace(`${varname}: ${message}`)
}

// Create a custom env-var instance
const { get } = from({
  variables: process.env,
  logger,
})

// Using the custom instance to read environment variables will print
// logs when the LOG_LEVEL is set to "trace" or the value defined in
// the LOG_LEVEL environment variable
const API_KEY = get('API_KEY').required().asString()
```

## Dotenv

You can optionally use [dotenv](https://www.npmjs.com/package/dotenv) with [env-var](https://www.npmjs.com/package/env-var).

There is no tight coupling between `dotenv` and env-var, but you can easily
both together. This loose coupling reduces package bloat and allows you to
start or stop using one without being forced to do the same for the other.

The following examples assume you've:

1. Run `npm install dotenv --save` in your project folder.
2. Created a _.env_ file in your repository.
3. Added `BASE_URL=http://foo.bar.com/` to your _.env_ file.

### Load dotenv via require()

This is per the default usage described by [`dotenv` README](https://www.npmjs.com/package/dotenv#usage).

```js
// Read in the .env file
require('dotenv').config()

// Read the BASE_URL entry that dotenv loaded into process.env
const { get } = require('env-var')

// Use env-var in the standard fashion - it just works
const url = env.get('BASE_URL').asUrlString()
```

### Preload dotenv via CLI Args

This is per the [preload section](https://www.npmjs.com/package/dotenv#preload)
of the [`dotenv` README](https://www.npmjs.com/package/dotenv#usage). Run the following code by using the
`node -r dotenv/config your_script.js` command.

```js
// This is just a regular node script, but we started it using the command
// "node -r dotenv/config your_script.js" via the terminal. This tells node
// to load our variables using dotenv before running the rest of our script!

// No need to call require('dotenv').config() 

const { get } = require('env-var')
const url = env.get('BASE_URL').asUrlString()
```

## Next.js

Accessing environments variables in the code for your API endpoints will work
as expected with env-var. The same is not true for your React pages,
components, etc.

You must explicitly pass `process.env` references to env-var in your React
codebase like to workaround how this is handled by the compilation steps used
by Next.js:

```js
import { from } from 'env-var'

const { get } = from({
  // Explicit reference to process.env.NEXT_PUBLIC_BASE_URL is required
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
})

// You can now read this using env-var
const url = get('NEXT_PUBLIC_BASE_URL').asUrlString()
```

Read the [Next.js environment variables documentation](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)
to get a better understanding of why this is necessary.

## React

React is similar to Next.js. You must create an env-var instance using
`from()`, and explicitly pass variables to it:

```js
import { from } from 'env-var'

const { get } = from({
  // Explicit reference to process.env.REACT_APP_BASE_URL is required
  REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL
})

// You can now read this using env-var
const url = get('REACT_APP_BASE_URL').asUrlString()
```

Read the [React documentation](https://create-react-app.dev/docs/adding-custom-environment-variables/) to get a better understanding of this.

## Vite

Vite exposes variables via the `import.meta.env` variable. It's necessary to
explicitly reference the variable per the Vite documentation.

```ts
import { from } from 'env-var'

const env = from({
  BASE_URL: import.meta.env.BASE_URL
})
```

## Other examples

The other examples are available in the `/example` directory.

* `catch-error.js`: demonstrates how you can use bluebird's custom catch functionality to respond to different error types.
* `catch-error-promise.js`: same as `catch-error.promise.js` but with promises.
* `custom-accessor.js`: demonstrates how you can build a custom accessor (e.g. `asIntBetween()`) by composing internal accessors available at `env.accessors`, and attach it to the env-var instance.
* `custom-accessor-2.ts`: Typescript version of `custom-accessor.js`.
* `logging.js`: self-explanatory.
* `typescript.ts`: common env-var usage in Typescript.