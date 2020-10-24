# env-var examples

This document provides example usage of a customer logger, and integration with `dotenv`. 

For more examples, refer to the `/example` directory.

### Directory

* [Custom logging](#custom-logging)
* [Dotenv](#dotenv)
* [Other examples](#other-examples)

## Custom logging

If you need to filter `env-var` logs based on log levels (e.g. trace logging only) or have your own preferred logger, you can use a custom logging solution such as `pino` easily.

### Pino logger example

```js
const pino = require('pino')()
const customLogger = (varname, str) => {
  // varname is the name of the variable being read, e.g "API_KEY"
  // str is the log message, e.g "verifying variable value is not empty"
  log.trace(`env-var log (${varname}): ${str}`)
}

const { from } =  require('env-var')
const env = from(process.env, {}, customLogger)

const API_KEY = env.get('API_KEY').required().asString()
```

## Dotenv

You can optionally use [dotenv](https://www.npmjs.com/package/dotenv) with [env-var](https://www.npmjs.com/package/env-var).

1. Just `npm install dotenv` and use it whatever way you're used to. 
2. You can use `dotenv` with `env-var` via a `require()` call in your code;
3. Or you can preload it with the `--require` or `-r` flag in the `node` CLI.

### Pre-requisite

- The examples below assume you have a `.env` file in your repository and it contains a line similar to `MY_VAR=a-string-value!`.

### Load dotenv via require()

This is per the default usage described by [`dotenv` README](https://www.npmjs.com/package/dotenv#usage).

```js
// Read in the .env file
require('dotenv').config()

// Read the MY_VAR entry that dotenv created
const env = require('env-var')
const myVar = env.get('MY_VAR').asString()
```

### Preload dotenv via CLI Args

This is per the [preload section](https://www.npmjs.com/package/dotenv#preload)
of the [`dotenv` README](https://www.npmjs.com/package/dotenv#usage).. Run the following code by using the
`node -r dotenv/config your_script.js` command.

```js
// This is just a regular node script, but we started it using the command
// "node -r dotenv/config your_script.js" via the terminal. This tells node
// to load our variables using dotenv before running the rest of our script!

// Read the MY_VAR entry that dotenv created
const env = require('env-var')
const myVar = env.get('MY_VAR').asString()
```

### Other examples

The other examples are available in the `/example` directory.

* `catch-error.js`: demonstrates how you can use bluebird's custom catch functionality to respond to different error types.
* `catch-error-promise.js`: same as `catch-error.promise.js` but with promises.
* `custom-accessor.js`: demonstrates how you can build a custom accessor (e.g. `asIntBetween()`) by composing internal accessors available at `env.accessors`, and attach it to the `env-var` instance.
* `custom-accessor-2.ts`: Typescript version of `custom-accessor.js`.
* `logging.js`: self-explanatory.
* `typescript.ts`: common `env-var` usage in Typescript.