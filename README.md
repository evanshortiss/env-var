# env-var

An elegant solution for loading environment variables in node.js.

## Install

```
npm install env-var --save
```

## Example
In the example below we read the environment variable *PARALLEL_LIMIT*, ensure
it is set (required), and parse it to an integer.
```js
var PARALLEL_LIMIT = env('PARALLEL_LIMIT').required().asInt();
```

## Overview
Over time it became apparent that parsing environment variables becomes a
repetitive task, and testing code that relies on them is cumbersome unless
using an inversion of control system for declaring modules so we can inject a
fake *process.env*.

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

With *env-var* the example above can be written cleanly:

```js
var env = require('env-var');

var MAX_BATCH_SIZE = env('MAX_BATCH_SIZE').required().asInt();
```

When it comes to testing code that relies on environment variables this is also
great since you can stub out *env-var* using *proxyquire* and *sinon* to easily
alter results returned without having to share state via *process.env*. A
demonstration of this is at the bottom of the README.


## API
The API is just a single function that's exposed, let's call it _env_.

### env([varname, [default]])
You can call this function 3 different ways:

1. Calling without arguments will return the entire _process.env_ Object.
2. Calling with _varname_ will return a variable instance with utilities for
parsing variables and is detailed below.
3. Calling with _varname_, and _default_ will return the value for _varname_
set on process.env, or if the variable is not set _default_ run through the
variable instance functions as though it was set on *process.env*.

### variable
A returned variable has the following functions defined for parsing to the required format.

##### required()
Ensure the variable is set on *process.env*, if not an exception will be thrown.

##### asInt()
Attempt to parse the variable to an integer. Throws an exception if parsing
fails. This is a strict check, meaning that if the *process.env* value is 1.2,
an exception will be raised rather than rounding up/down.

##### asFloat()
Attempt to parse the variable to a float. Throws an exception if parsing fails.

##### asString()
Return the variable value as a String. Throws an exception if value is not a
String. It's highly unlikely that a variable will not be a String since all
*process.env* entries you set in bash are Strings by default.

##### asBool()
Attempt to parse the variable to a Boolean. Throws an exception if parsing
fails. The var must be set to either "true" or "false" to succeed.

##### asJson()
Attempt to parse the variable to a JSON Object. Throws an exception if parsing
fails.


## Example

```js
var env = require('env-var');

// Normally these would be set using "export VARNAME" or similar in bash
process.env.STRING = 'test';
process.env.INTEGER = '12';
process.env.BOOL = 'false';
process.env.JSON = '{"key":"value"}';

// The entire process.env object
var allVars = env();

// Returns a string. Throws an exception if not set
var stringVar = env('STRING').required().asString();

// Return an int, or undefined if not set, and throws if set to a non integer value
var intVar = env('INTEGER').asInt();

// Return a float, or 23.2 if not set
var floatVar = env('FLOAT', '23.2').asFloat();

// Return a Boolean. Throws an exception if not set or parsing fails
var boolVar = env('BOOL').required().asBool();

// Return a JSON Object, or undefined if not set, or throws if set to invalid JSON
var jsonVar = env('JSON').asJson();
```


## Testing Benefits

When testing code that relies on environment variables sometimes we need to
mock out/set the environment variables. Having calls to _process.env_ strewn
throughout a test is and can get confusing and modifies global state (not good).

It's better to use *env-var* and do something along these lines:

```js
/**
 * filename: concat.js
 * Reads in a var and constructs a string by adding the var name plus its value
 */

var env = require('env-var');

exports.concat = function (envVarToGet) {
  return envVarToGet + ' ' + env(envVarToGet).asString();
};
```

```js
/**
 * filename: concat.test.js
 * Reads in a var and constructs a string by adding the var name plus its value
 */

var sinon = require('sinon');
var expect = require('chai').expect;
var proxyquire = require('proxyquire');

describe('module test', function () {

  var envStub;
  var mod;

  beforeEach(function () {
    envStub = sinon.stub();

    // Require our concat file, but stub out env-var
    mod = proxyquire('./concat', {
      'env-var': sinon.stub().returns({
        asString: sinon.stub().returns('WORLD')
      })
    });
  });

  describe('#concat', function () {
    it('should combine our var name and returned value', function () {
      expect(mod.concat('HELLO')).to.equal('HELLO WORLD');
    });
  });
});

```
