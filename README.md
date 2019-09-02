# env-var

<div align="center">

[![Travis CI](https://travis-ci.org/evanshortiss/env-var.svg?branch=master)](https://travis-ci.org/evanshortiss/env-var)
[![Coverage Status](https://coveralls.io/repos/github/evanshortiss/env-var/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/env-var?branch=master)
[![NPM version](https://img.shields.io/npm/v/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](http://www.typescriptlang.org/)

[![npm downloads](https://img.shields.io/npm/dm/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![Known Vulnerabilities](https://snyk.io//test/github/evanshortiss/env-var/badge.svg?targetFile=package.json)](https://snyk.io//test/github/evanshortiss/env-var?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/evanshortiss/env-var.svg)](https://greenkeeper.io/)

</div>

Verification, sanatization, and type coercion for environment variables in
Node.js. Particularly useful in TypeScript environments.

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
  // Convert DB_PASSWORD from base64 to a regular utf8 string (optional)
  .convertFromBase64()
  // Call asString (or other methods) to get the variable value (required)
  .asString();

// Read in a port (checks that PORT is in the raneg 0 to 65535) or use a
// default value of 5432 instead
const PORT = env.get('PORT', 5432).asPortNumber()
```

## TypeScript

```ts
import * as env from 'env-var';

// Read a PORT environment variable and ensure it's a positive number
// An EnvVarError will be thrown if the variable is not set, or is not a number
const PORT: number = env.get('PORT').required().asIntPositive();
```

## Benefits
Fail fast if your environment is misconfigured. Also,
[this code](https://gist.github.com/evanshortiss/75d936665a2a240fa1966770a85fb137) without
`env-var` would require multiple `assert` calls, other logic, and be more
complex to understand as [demonstrated here](https://gist.github.com/evanshortiss/0cb049bf676b6138d13384671dad750d).

## API

### Structure:

* module (env-var)
  * [EnvVarError()](#envvarerror)
  * [from()](#fromvalues-extraaccessors)
  * [get()](#getvarname-default)
    * [variable](#variable)
      * [required()](#requiredisrequired--true)
      * [covertFromBase64()](#convertfrombase64)
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
  * [addAccessor()](#addaccessorname-accessor)

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

### from(values, extraAccessors)
This function is useful if you're not in a typical Node.js environment, or for
testing. It allows you to generate an env-var instance that reads from the
given `values` instead of the default `process.env`.

```js
const env = require('env-var').from({
  API_BASE_URL: 'https://my.api.com/'
})

// apiUrl will be 'https://my.api.com/'
const apiUrl = mockedEnv.get('API_BASE_URL').asUrlString()
```

#### extraAccessors
When calling `from()` you can also pass an optional argument containing
additional accessors that will be attached to any variables gotten by that
env-var instance.

Accessor functions must accept at least two arguments:

- `{Function} raiseError`: If the accessor fails to process a value, it must
  call this function instead of throwing an exception.
- `{*} value`: The value that the accessor should process.

**Important:** Do not assume that `value` is a string!

Example:
```js
const { from } = require('env-var')

// Environment variable that we will use for this example:
process.env.ADMIN = 'admin@example.com'

// Add an accessor named 'checkEmail' that verifies that the value is a
// valid-looking email address.
const env = from(process.env, {
  checkEmail: (raiseError, value) => {
    const split = String(value).split('@')

    // Validating email addresses is hard.
    if (split.length !== 2) {
      raiseError('must contain exactly one "@"')
    }

    return value
  }
})

// We specified 'checkEmail' as the name for the accessor when we called
// `addAccessor()` above, so now we can call `checkEmail()` like any
// other accessor.
let validEmail = env.get('ADMIN').checkEmail()
```

The accessor function may accept additional arguments if desired; these must be
provided explicitly when the accessor is invoked.

For example, we can modify the `checkEmail()` accessor from above so that it
optionally verifies the domain of the email address:
```js
const { from } = require('env-var')

// Environment variable that we will use for this example:
process.env.ADMIN = 'admin@example.com'

// Add an accessor named 'checkEmail' that verifies that the value is a
// valid-looking email address.
//
// Note that the accessor function also accepts an optional third
// parameter `requiredDomain` which can be provided when the accessor is
// invoked (see below).
const env = from(process.env, {
  checkEmail: (raiseError, value, requiredDomain) => {
    const split = String(value).split('@')

    // Validating email addresses is hard.
    if (split.length !== 2) {
      raiseError('must contain exactly one "@"')
    }

    if (requiredDomain && (split[1] !== requiredDomain)) {
      raiseError(`must end with @${requiredDomain}`)
    }

    return value
  }
})

// We specified 'checkEmail' as the name for the accessor when we called
// `addAccessor()` above, so now we can call `checkEmail()` like any
// other accessor.
//
// `env-var` will provide the first two arguments for the accessor
// function (`raiseError` and `value`), but we declared a third argument
// `requiredDomain`, which we can provide when we invoke the accessor.

// Calling the accessor without additional parameters accepts an email
// address with any domain.
let validEmail = env.get('ADMIN').checkEmail()

// If we specify a parameter, then the email address must end with the
// domain we specified.
let invalidEmail = env.get('ADMIN').checkEmail('github.com')
```

### get([varname, [default]])
You can call this function 3 different ways:

```js
const env = require('env-var')

// #1 - Return the requested variable (we're also checking it's a positive int)
const limit = env.get('SOME_LIMIT').asIntPositive()

// #2 - Return the requested variable, or use the given default if it isn't set
const limit = env.get('SOME_LIMIT', '10').asIntPositive()

// #3 - Return the environment object (process.env by default - see env.from() docs for more)
const allvars = env.get()
```

### variable
A variable is returned by calling `env.get`. It has the exposes the following
functions to validate and access the underlying value.

#### required(isRequired = true)
Ensure the variable is set on *process.env*. If the variable is not set this
function will throw an `EnvVarError`. If the variable is set it returns itself
so you can access the underlying variable.

Can be bypassed by passing `false`, i.e `required(false)`

Full example:

```js
const env = require('env-var')

// Read PORT variable and ensure it's a positive integer. If it is not a
// positive integer or is not set the process will exit with an error (unless
// you catch it using a try/catch or "uncaughtException" handler)
const NODE_ENV = env.get('NODE_ENV').asString()
const PORT = env.get('PORT').required().asIntPositive()

// If mode is production then this is required, else use default
const SECRET = env.get('SECRET', 'bad-secret').required(NODE_ENV === 'production').asString()

app.listen(PORT)
```

#### convertFromBase64()
Sometimes environment variables need to be encoded as base64. You can use this
function to convert them to UTF-8 strings before parsing them.

For example if we run the script script below, using the command `DB_PASSWORD=
$(echo -n 'secret_password' | base64) node`, we'd get the following results:

```js
console.log(process.env.DB_PASSWORD) // prints "c2VjcmV0X3Bhc3N3b3Jk"

// dbpass will contain the converted value of "secret_password"
const dbpass = env.get('DB_PASSWORD').convertFromBase64().asString()
```

#### asPortNumber()
Converts the value of the environment variable to a string and verifies it's
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
positive (greater than zero).

#### asIntNegative()
Performs the same task as _asInt()_, but also verifies that the number is
negative (less than zero).

#### asFloat()
Attempt to parse the variable to a float. Throws an exception if parsing fails.

#### asFloatPositive()
Performs the same task as _asFloat()_, but also verifies that the number is
positive (greater than zero).

#### asFloatNegative()
Performs the same task as _asFloat()_, but also verifies that the number is
negative (less than zero).

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

// Returns a string. Throws an exception if not set
const stringVar = env.get('STRING').required().asString();

// Returns an int, undefined if not set, or throws if set to a non integer value
const intVar = env.get('INTEGER').asInt();

// Return a float, or 23.2 if not set
const floatVar = env.get('FLOAT', '23.2').asFloat();

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

## Contributing
Contributions are welcomed. If you'd like to discuss an idea open an issue, or a
PR with an initial implementation.

If you want to add a new global accessor, it's easy. Add a file to
`lib/accessors`, with the name of the type e.g add a file named `number-zero.js`
into that folder and populate it with code following this structure:

```js
/**
 * Validate that the environment value is an integer and equals zero.
 * @param {Function} raiseError use this to raise a cleanly formatted error
 * @param {String}   environmentValue this is the string from process.env
 */
module.exports = function numberZero (raiseError, environmentValue) {

  // Your custom code should go here...below code is an example

  const val = parseInt(environmentValue)

  if (val === 0) {
    return ret;
  } else {
    raiseError('should be zero')
  }
}
```

Next update the `accessors` Object in `getVariableAccessors()` in
`lib/variable.js` to include your new module. The naming convention should be of
the format "asTypeSubtype", so for our `number-zero` example it would be done
like so:

```js
asNumberZero: generateAccessor(container, varName, defValue, require('./accessors/number-zero')),
```

Once you've done that, add some unit tests and use it like so:

```js
// Uses your new function to ensure the SOME_NUMBER is the integer 0
env.get('SOME_NUMBER').asNumberZero()
```

## Contributors
* @caccialdo
* @evanshortiss
* @gabrieloczkowski
* @hhravn
* @itavy
* @MikeyBurkman
* @pepakriz
* @rmblstrp
