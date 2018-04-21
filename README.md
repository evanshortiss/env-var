# env-var

[![Travis CI](https://travis-ci.org/evanshortiss/env-var.svg?branch=master)](https://travis-ci.org/evanshortiss/env-var)
[![Coverage Status](https://coveralls.io/repos/github/evanshortiss/env-var/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/env-var?branch=master)
[![npm version](https://badge.fury.io/js/env-var.svg)](https://badge.fury.io/js/env-var)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

solution for loading and sanitizing environment variables in node.js with correct typings

## Install

```
npm install env-var --save
```

## Example
In the example below we read the environment variable *PARALLEL_LIMIT*, ensure
it is set, and parse it to an integer.

```js
const LIMIT = env.get('LIMIT').required().asIntPositive();
```

Here's what each piece of this code means:

1. If *LIMIT* is not set _required()_ will raise an exception.
2. If it is set, but not a positive integer _asIntPositive()_ will raise an
exception.
3. If #1 and #2 do not raise an exception, the number will be returned as a
valid JavaScript number type.


## TypeScript
To use with TypeScript, just import and use the same as JavaScript:

```ts
import * as env from 'env-var';

const LIMIT = env.get('LIMIT').required().asIntPositive();
```

## Overview
Over time it became apparent that parsing environment variables is a
repetitive task, and testing code that relies on can be cumbersome.

Take this example:

```js
var assert = require('assert');

// Our program requires this var to be set
assert.notEqual(
  process.env.MAX_BATCH_SIZE,
  undefined,
  'MAX_BATCH_SIZE environment variable must be set'
);

// Read the var, and use parseInt to make it a number
var MAX_BATCH_SIZE = parseInt(process.env.MAX_BATCH_SIZE, 10);

// Check the var is a valid number, if not throw
assert(
  typeof MAX_BATCH_SIZE === 'number' && !isNaN(MAX_BATCH_SIZE),
  'MAX_BATCH_SIZE env var must be a valid number'
);
```

With *env-var* the example above can be written cleanly as:

```js
var env = require('env-var');

var MAX_BATCH_SIZE = env.get('MAX_BATCH_SIZE').required().asInt();
```

When it comes to testing code that relies on environment variables this is also
great since you can mock out *env-var* using *proxyquire* to easily alter
results returned without having to share state via *process.env*. A
demonstration of this is at the bottom of the README.


## API

### env.get([varname, [default]])
You can call this function 3 different ways:

1. Calling without arguments will return the entire _process.env_ Object.
2. Calling with _varname_ will return a _variable_ instance with utilities for
parsing variables and is detailed below.
3. Calling with _varname_, and _default_ will return the value for _varname_
set on process.env, or if the variable is not set _default_ run through the
variable instance functions as though it was set on *process.env*.


### env.EnvVarError
This is the error class used to represent errors raised by this module. You can
use it like so:

```js
const env = require('env-var')

try {
  // will throw if you have not set this variable
  env.get('MISSING_VARIABLE').required().asString()

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

### variable
A returned variable has the following functions defined for parsing to the
required format.

#### required()
Ensure the variable is set on *process.env*. If the variable is not set, then
this function will throw an `EnvVarError`. Typically you will use this during
the initialisation of your program in order to fail fast if a required variable
is not set.

For example:

```js
const env = require('env-var')

// Read PORT variable and ensure it's a positive integer. If it is not a
// positive integer or is not set the process will exit with an error (unless
// you catch it using a try/catch or "uncaughtException" handler)
const PORT = env.get('PORT').required().asIntPositive()

app.listen(PORT)
```

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

#### asArray([delimiter])
Reads an environment variable as a string, then splits it on each occurence of
the specified _delimiter_. By default a comma is used as the delimiter. For
example a var set to "1,2,3" would become ['1', '2', '3'].

#### asUrlString()
Verifies that the variable is a valid URL string and returns that string. Uses
`is-url` to perform validation, so check that module for validation rules.

#### asUrlObject()
Verifies that the variable is a valid URL string, then parses it using
`url.parse` from the Node.js core `url` module and returns the parsed Object.
See the [Node.js docs](https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost) for more info

## Example

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
```


## Testing Overview

When testing code that relies on environment variables sometimes we need to
mock out/set the environment variables. Having calls to _process.env_ strewn
throughout a test is and can get confusing and modifies global state (not good).

It's better to use *env-var* and its built-in `mock()` function. Using `mock()`
will allow you to create a mocked version of env-var which will use a literal
object **instead** of using _process.env_. You can use this mocked version with
something like `proxyquire`. For example:

```js
/**
 * filename: concat.js
 * Reads in a var and constructs a string by adding the var name plus its value
 */

var env = require('env-var');

exports.concat = function (envVarToGet) {
  return envVarToGet + ' ' + env.get(envVarToGet).required().asString();
};
```

```js
/**
 * filename: concat.test.js
 * Reads in a var and constructs a string by adding the var name plus its value
 */

var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var env = require('env-var');

describe('concat.js', function () {

  var mod;

  beforeEach(function () {
    // Require our concat file, but replace env-var with a mocked version.
    // This mocked version will NOT use process.env
    mod = proxyquire('./concat', {
      'env-var': env.mock({
        HELLO: 'WORLD'
      })
    });

  });

  describe('#concat', function () {
    it('should combine our var name and its returned value', function () {
      expect(mod.concat('HELLO')).to.equal('HELLO WORLD');
    });
  });
});

```

## Contributors
* @MikeyBurkman
* @itavy


## Contributing
Contributions are welcomed. If you'd like to discuss an idea open an issue, or a
PR with an initial implementation.

If you want to add a new type it's pretty easy. Add a file to `lib/accessors`,
with the name of the type e.g add a file named `number-zero.js` into that folder
and populate it with code following this structure:

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
