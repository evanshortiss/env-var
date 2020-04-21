# env-var

<div align="center">

[![NPM version](https://img.shields.io/npm/v/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/env-var)](https://opensource.org/licenses/MIT)
[![Travis CI](https://travis-ci.org/evanshortiss/env-var.svg?branch=master)](https://travis-ci.org/evanshortiss/env-var)
[![Coverage Status](https://coveralls.io/repos/github/evanshortiss/env-var/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/env-var?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![Known Vulnerabilities](https://snyk.io//test/github/evanshortiss/env-var/badge.svg?targetFile=package.json)](https://snyk.io//test/github/evanshortiss/env-var?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/evanshortiss/env-var.svg)](https://greenkeeper.io/)

Verification, sanitization, and type coercion for environment variables in
Node.js. Supports TypeScript!
<br>
<br>
</div>

* 🏋 Lightweight. Zero dependencies and just ~4.7kB when minified!
* 🧹 Cleaner code, as [shown here](https://gist.github.com/evanshortiss/0cb049bf676b6138d13384671dad750d)
* 🚫 [Fail fast](https://en.wikipedia.org/wiki/Fail-fast) if your environment is misconfigured
* 👩‍💻 Friendly error messages and example values improve developer experience
* 🎉 TypeScript support provides compile time safety and better developer experience


## Install
**Note:** env-var requires Node version 8 or later.

### npm
```
npm install env-var --save
```

### yarn
```
yarn add env-var
```

## Usage
In the example below we read the environment variable *DB_PASSWORD* and call
some functions to verify it satisfies our program's needs.

```js
const env = require('env-var');

// Or using import syntax:
// import * as env from 'env-var'

const PASSWORD = env.get('DB_PASSWORD')
  // Throws an error if the DB_PASSWORD variable is not set (optional)
  .required()
  // Decode DB_PASSWORD from base64 to a utf8 string (optional)
  .convertFromBase64()
  // Call asString (or other APIs) to get the variable value (required)
  .asString();

// Read in a port (checks that PORT is in the range 0 to 65535)
// Alternatively, use amdefault value of 5432 if PORT is not defined
const PORT = env.get('PORT').default('5432').asPortNumber()
```

## TypeScript

```ts
import * as env from 'env-var';

// Read a PORT environment variable and ensure it's a positive integer.
// An EnvVarError will be thrown if the variable is not set, or if it
// is not a positive integer.
const PORT: number = env.get('PORT').required().asIntPositive();
```

## Usage with dotenv

There is no tight coupling between [env-var](https://www.npmjs.com/package/env-var)
and [dotenv](https://www.npmjs.com/package/dotenv). Just `npm install dotenv`
and use it whatever way you're used to. This loose coupling is a good thing
since it reduces package bloat - only install what you need!

You can use `dotenv` with `env-var` via a `require()` calls in your code or
preloading it with the `--require` or `-r` flag in the `node` CLI.

Both examples below assume you have a `.env` file in your repository and it
contains a line similar to `MY_VAR=a-string-value!`.

### Load dotenv via require()

This is per the default usage described by [dotenv's README](https://www.npmjs.com/package/dotenv#usage).

```js
// Read in the .env file
require('dotenv').config()

// Read the MY_VAR entry that dotenv created
const env = require('env-var')
const myVar = env.get('MY_VAR').asString()
```

### Preload dotenv via CLI Args

This is per the [preload section](https://www.npmjs.com/package/dotenv#preload)
of the dotenv README. Run the following code by using the
`node -r dotenv/config your_script.js` command.

```js
// This is just a regular node script, but we started it using the command
// "node -r dotenv/config your_script.js" via the terminal. This tells node
// to load our variables using dotenv before running the rest of our script!

// Read the MY_VAR entry that dotenv created
const env = require('env-var')
const myVar = env.get('MY_VAR').asString()
```

## API

### Structure:

* module (env-var)
  * [from()](#fromvalues-extraaccessors)
  * [get()](#getvarname)
    * [variable](#variable)
      * [required()](#requiredisrequired--true)
      * [covertFromBase64()](#convertfrombase64)
      * [example(string)](#examplestring)
      * [default(string)](#defaultstring)
      * [asArray()](#asarraydelimiter-string)
      * [asBoolStrict()](#asboolstrict)
      * [asBool()](#asbool)
      * [asPortNumer()](#asportnumber)
      * [asEnum()](#asenumvalidvalues-string)
      * [asFloatNegative()](#asfloatnegative)
      * [asFloatPositive()](#asfloatpositive)
      * [asFloat()](#asfloat)
      * [asIntNegative()](#asintnegative)
      * [asIntPositive()](#asintpositive)
      * [asInt()](#asint)
      * [asJsonArray()](#asjsonarray)
      * [asJsonObject()](#asjsonobject)
      * [asJson()](#asjson)
      * [asString()](#asstring)
      * [asUrlObject()](#asurlobject)
      * [asUrlString()](#asurlstring)
  * [EnvVarError()](#envvarerror)

### from(values, extraAccessors)
This function is useful if you're not in a typical Node.js environment, or for
testing. It allows you to generate an env-var instance that reads from the
given `values` instead of the default `process.env` Object.

```js
const env = require('env-var').from({
  API_BASE_URL: 'https://my.api.com/'
})

// apiUrl will be 'https://my.api.com/'
const apiUrl = env.get('API_BASE_URL').asUrlString()
```

When calling `env.from()` you can also pass an optional parameter containing
custom accessors that will be attached to any variables returned by that
env-var instance. This feature is explained in the
[extraAccessors section](#extraAccessors) of these docs.

### get(varname)
This function has two behaviours:

1. Calling with a string argument will make it read that value from the environment
2. If no string argument is passed it will return the entire environment object

Examples:

```js
const env = require('env-var')

// #1 - Read the requested variable and parse it to a positive integer
const limit = env.get('MAX_CONNECTIONS').asIntPositive()

// #2 - Returns the entire process.env object
const allVars = env.get()
```

### variable
A variable is returned by calling `env.get(varname)`. It exposes the following
functions to validate and access the underlying value, set a default, or set
an example value:

#### example(string)
Allows a developer to provide an example of a valid value for the environment
variable. If the variable is not set (and `required()` was called), or the
variable is set incorrectly this will be included in error output to help
developers diagnose the error.

For example:

```js
const env = require('env-var')

const ADMIN_EMAIL = env.get('ADMIN_EMAIL')
  .required()
  .example('admin@example.com')
  .asString()
```

If *ADMIN_EMAIL* was not set this code would throw an error similar to that
below to help a developer diagnose the issue:

```
env-var: "ADMIN_EMAIL" is a required variable, but it was not set. An example
of a valid value would be "admin@example.com"
```

#### default(string)
Allows a default value to be provided for use if the desired environment
variable is not set in the program environment.

Example:

```js
const env = require('env-var')

// Use POOL_SIZE if set, else use a value of 10
const POOL_SIZE = env.get('POOL_SIZE').default('10').asIntPositive()
```

#### required(isRequired = true)
Ensure the variable is set on *process.env*. If the variable is not set, or is
set to an empty value, this function will cause an `EnvVarError` to be thrown
when you attempt to read the value using `asString` or a similar function.

The `required()` check can be bypassed by passing `false`, i.e
`required(false)`

Example:

```js
const env = require('env-var')

// Get the value of NODE_ENV as a string. Could be undefined since we're
// not calling required() before asString()
const NODE_ENV = env.get('NODE_ENV').asString()

// Read PORT variable and ensure it's in a valid port range. If it's not in
// valid port ranges, not set, or empty an EnvVarError will be thrown
const PORT = env.get('PORT').required().asPortNumber()

// If mode is production then this is required
const SECRET = env.get('SECRET').required(NODE_ENV === 'production').asString()
```

#### convertFromBase64()
It's a common need to set an environment variable in base64 format. This
function can be used to decode a base64 environment variable to UTF8.

For example if we run the script script below, using the command `DB_PASSWORD=
$(echo -n 'secret_password' | base64) node`, we'd get the following results:

```js
console.log(process.env.DB_PASSWORD) // prints "c2VjcmV0X3Bhc3N3b3Jk"

// dbpass will contain the converted value of "secret_password"
const dbpass = env.get('DB_PASSWORD').convertFromBase64().asString()
```

#### asPortNumber()
Converts the value of the environment variable to an integer and verifies it's
within the valid port range of 0-65535. As a result well known ports are
considered valid by this function.

#### asEnum(validValues: string[])
Converts the value to a string, and matches against the list of valid values.
If the value is not valid, an error will be raised describing valid input.

#### asInt()
Attempt to parse the variable to an integer. Throws an exception if parsing
fails. This is a strict check, meaning that if the *process.env* value is "1.2",
an exception will be raised rather than rounding up/down.

#### asIntPositive()
Performs the same task as _asInt()_, but also verifies that the number is
positive (greater than or equal to zero).

#### asIntNegative()
Performs the same task as _asInt()_, but also verifies that the number is
negative (less than or equal to zero).

#### asFloat()
Attempt to parse the variable to a float. Throws an exception if parsing fails.

#### asFloatPositive()
Performs the same task as _asFloat()_, but also verifies that the number is
positive (greater than or equal to zero).

#### asFloatNegative()
Performs the same task as _asFloat()_, but also verifies that the number is
negative (less than or equal to zero).

#### asString()
Return the variable value as a String. Throws an exception if value is not a
String. It's highly unlikely that a variable will not be a String since all
*process.env* entries you set in bash are Strings by default.

#### asBool()
Attempt to parse the variable to a Boolean. Throws an exception if parsing
fails. The var must be set to either "true", "false" (upper or lowercase),
0 or 1 to succeed.

#### asBoolStrict()
Attempt to parse the variable to a Boolean. Throws an exception if parsing
fails. The var must be set to either "true" or "false" (upper or lowercase) to
succeed.

#### asJson()
Attempt to parse the variable to a JSON Object or Array. Throws an exception if
parsing fails.

#### asJsonArray()
The same as _asJson_ but checks that the data is a JSON Array, e.g [1,2].

#### asJsonObject()
The same as _asJson_ but checks that the data is a JSON Object, e.g {a: 1}.

#### asArray([delimiter: string])
Reads an environment variable as a string, then splits it on each occurence of
the specified _delimiter_. By default a comma is used as the delimiter. For
example a var set to "1,2,3" would become ['1', '2', '3']. Example outputs for
specific values are:

* Reading `MY_ARRAY=''` results in `[]`
* Reading `MY_ARRAY='1'` results in `['1']`
* Reading `MY_ARRAY='1,2,3'` results in `['1', '2', '3']`

#### asUrlString()
Verifies that the variable is a valid URL string and returns the validated
string. The validation is performed by passing the URL string to the
[Node.js URL Constructor](https://nodejs.org/docs/latest/api/url.html).

#### asUrlObject()
Verifies that the variable is a valid URL string using the same method as
`asUrlString()`, but instead returns the resulting URL instance. For details
see the [Node.js URL docs](https://nodejs.org/docs/latest/api/url.html).

### EnvVarError()
This is the error class used to represent errors raised by this module. Sample
usage:

```js
const env = require('env-var')
let value = null

try {
  // will throw if you have not set this variable
  value = env.get('MISSING_VARIABLE').required().asString()

  // if catch error is set, we'll end up throwing here instead
  throw new Error('some other error')
} catch (e) {
  if (e instanceof env.EnvVarError) {
    console.log('we got an env-var error', e)
  } else {
    console.log('we got some error that wasn\'t an env-var error', e)
  }
}
```

## Examples

```js
const env = require('env-var');

// Normally these would be set using "export VARNAME" or similar in bash
process.env.STRING = 'test';
process.env.INTEGER = '12';
process.env.BOOL = 'false';
process.env.JSON = '{"key":"value"}';
process.env.COMMA_ARRAY = '1,2,3';
process.env.DASH_ARRAY = '1-2-3';

// The entire process.env object
const allVars = env.get();

// Returns a string. Throws an exception if not set or empty
const stringVar = env.get('STRING').required().asString();

// Returns an int, undefined if not set, or throws if set to a non integer value
const intVar = env.get('INTEGER').asInt();

// Return a float, or 23.2 if not set
const floatVar = env.get('FLOAT').default('23.2').asFloat();

// Return a Boolean. Throws an exception if not set or parsing fails
const boolVar = env.get('BOOL').required().asBool();

// Returns a JSON Object, undefined if not set, or throws if set to invalid JSON
const jsonVar = env.get('JSON').asJson();

// Returns an array if defined, or undefined if not set
const commaArray = env.get('COMMA_ARRAY').asArray();

// Returns an array if defined, or undefined if not set
const commaArray = env.get('DASH_ARRAY').asArray('-');

// Returns the enum value if it's one of dev, test, or live
const enumVal = env.get('ENVIRONMENT').asEnum(['dev', 'test', 'live'])
```

## extraAccessors
When calling `from()` you can also pass an optional parameter containing
additional accessors that will be attached to any variables gotten by that
env-var instance.

Accessor functions must accept at least one argument:

- `{*} value`: The value that the accessor should process.

**Important:** Do not assume that `value` is a string!

Example:
```js
const { from } = require('env-var')

// Environment variable that we will use for this example:
process.env.ADMIN = 'admin@example.com'

// Add an accessor named 'asEmail' that verifies that the value is a
// valid-looking email address.
const env = from(process.env, {
  asEmail: (value) => {
    const split = String(value).split('@')

    // Validating email addresses is hard.
    if (split.length !== 2) {
      throw new Error('must contain exactly one "@"')
    }

    return value
  }
})

// We specified 'asEmail' as the name for the accessor above, so now
// we can call `asEmail()` like any other accessor.
let validEmail = env.get('ADMIN').asEmail()
```

The accessor function may accept additional arguments if desired; these must be
provided explicitly when the accessor is invoked.

For example, we can modify the `asEmail()` accessor from above so that it
optionally verifies the domain of the email address:
```js
const { from } = require('env-var')

// Environment variable that we will use for this example:
process.env.ADMIN = 'admin@example.com'

// Add an accessor named 'asEmail' that verifies that the value is a
// valid-looking email address.
//
// Note that the accessor function also accepts an optional second
// parameter `requiredDomain` which can be provided when the accessor is
// invoked (see below).
const env = from(process.env, {
  asEmail: (value, requiredDomain) => {
    const split = String(value).split('@')

    // Validating email addresses is hard.
    if (split.length !== 2) {
      throw new Error('must contain exactly one "@"')
    }

    if (requiredDomain && (split[1] !== requiredDomain)) {
      throw new Error(`must end with @${requiredDomain}`)
    }

    return value
  }
})

// We specified 'asEmail' as the name for the accessor above, so now
// we can call `asEmail()` like any other accessor.
//
// `env-var` will provide the first argument for the accessor function
// (`value`), but we declared a second argument `requiredDomain`, which
// we can provide when we invoke the accessor.

// Calling the accessor without additional parameters accepts an email
// address with any domain.
let validEmail = env.get('ADMIN').asEmail()

// If we specify a parameter, then the email address must end with the
// domain we specified.
let invalidEmail = env.get('ADMIN').asEmail('github.com')
```

This feature is also available for TypeScript users. The `ExtensionFn` type is
exposed to help in the creation of these new accessors.

```ts
import { from, ExtensionFn, EnvVarError } from 'env-var'

// Environment variable that we will use for this example:
process.env.ADMIN = 'admin@example.com'

const asEmail: ExtensionFn<string> = (value) => {
  const split = String(value).split('@')

  // Validating email addresses is hard.
  if (split.length !== 2) {
    throw new Error('must contain exactly one "@"')
  }

  return value
}

const env = from(process.env, {
  asEmail
})

// Returns the email string if it's valid, otherwise it will throw
env.get('ADMIN').asEmail()
```

## Contributing
Contributions are welcomed and discussed in the `CONTRIBUTING.md` file in this
repo. If you'd like to discuss an idea open an issue, or a PR with an initial
implementation.

## Contributors
* @caccialdo
* @evanshortiss
* @gabrieloczkowski
* @hhravn
* @itavy
* @joh-klein
* @MikeyBurkman
* @pepakriz
* @rmblstrp
* @shawnmclean
* @todofixthis
* @xuo
