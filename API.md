# API

This document lists all API methods `env-var` has.

## Structure

* module (env-var)
  * [from()](#fromvalues-extraaccessors-logger)
  * [get()](#getvarname)
    * [variable](#variable)
      * [example(string)](#examplestring)
      * [default(string)](#defaultstring)
      * [required()](#requiredisrequired--true)
      * [covertFromBase64()](#convertfrombase64)
      * [asArray()](#asarraydelimiter-string)
      * [asBool()](#asbool)
      * [asBoolStrict()](#asboolstrict)
      * [asEnum()](#asenumvalidvalues-string)
      * [asFloat()](#asfloat)
      * [asFloatNegative()](#asfloatnegative)
      * [asFloatPositive()](#asfloatpositive)
      * [asInt()](#asint)
      * [asIntNegative()](#asintnegative)
      * [asIntPositive()](#asintpositive)
      * [asJson()](#asjson)
      * [asJsonArray()](#asjsonarray)
      * [asJsonObject()](#asjsonobject)
      * [asPortNumber()](#asportnumber)
      * [asRegExp()](#asregexpflags-string)
      * [asString()](#asstring)
      * [asUrlObject()](#asurlobject)
      * [asUrlString()](#asurlstring)
  * [EnvVarError()](#envvarerror)
  * [accessors](#accessors)

## from(values, extraAccessors, logger)

This function is useful if you are not in a typical Node.js environment, or for
testing. It allows you to generate an `env-var` instance that reads from the
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
`env-var` instance. This feature is explained in the
[extraAccessors section](#extraAccessors) of these docs.

Logging can be enabled by passing a logger function that matches the signature:

```js
/**
 * Logs the provided string argument
 * @param {String} varname
 * @param {String} str
 */
function yourLoggerFn (varname, str) {
  // varname is the name of the variable being read, e.g "API_KEY"
  // str is the log message, e.g "verifying variable value is not empty"
}
```

## get(varname)

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

#### asArray([delimiter: string])

Reads an environment variable as a string, then splits it on each occurence of
the specified _delimiter_. By default a comma is used as the delimiter. For
example a var set to "1,2,3" would become ['1', '2', '3']. Example outputs for
specific values are:

* Reading `MY_ARRAY=''` results in `[]`
* Reading `MY_ARRAY='1'` results in `['1']`
* Reading `MY_ARRAY='1,2,3'` results in `['1', '2', '3']`

#### asBool()

Attempt to parse the variable to a Boolean. Throws an exception if parsing
fails. The var must be set to either "true", "false" (upper or lowercase),
0 or 1 to succeed.

#### asBoolStrict()

Attempt to parse the variable to a Boolean. Throws an exception if parsing
fails. The var must be set to either "true" or "false" (upper or lowercase) to
succeed.

#### asEnum(validValues: string[])

Converts the value to a string, and matches against the list of valid values.
If the value is not valid, an error will be raised describing valid input.

#### asFloat()

Attempt to parse the variable to a float. Throws an exception if parsing fails.

#### asFloatNegative()

Performs the same task as _asFloat()_, but also verifies that the number is
negative (less than or equal to zero).

#### asFloatPositive()

Performs the same task as _asFloat()_, but also verifies that the number is
positive (greater than or equal to zero).

#### asInt()

Attempt to parse the variable to an integer. Throws an exception if parsing
fails. This is a strict check, meaning that if the *process.env* value is "1.2",
an exception will be raised rather than rounding up/down.

#### asIntNegative()

Performs the same task as _asInt()_, but also verifies that the number is
negative (less than or equal to zero).

#### asIntPositive()

Performs the same task as _asInt()_, but also verifies that the number is
positive (greater than or equal to zero).

#### asJson()

Attempt to parse the variable to a JSON Object or Array. Throws an exception if
parsing fails.

#### asJsonArray()

The same as _asJson_ but checks that the data is a JSON Array, e.g. [1,2].

#### asJsonObject()

The same as _asJson_ but checks that the data is a JSON Object, e.g. {a: 1}.

#### asPortNumber()

Converts the value of the environment variable to an integer and verifies it's
within the valid port range of 0-65535. As a result well known ports are
considered valid by this function.

#### asRegExp([flags: string])

Read in the variable and construct a [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
instance using its value. An optional `flags` argument is supported. The string
passed for `flags` is passed as the second argument to the `RegExp` constructor.

#### asString()

Return the variable value as a String. Throws an exception if value is not a
String. It's highly unlikely that a variable will not be a String since all
*process.env* entries you set in bash are Strings by default.

#### asUrlObject()

Verifies that the variable is a valid URL string using the same method as
`asUrlString()`, but instead returns the resulting URL instance. For details
see the [Node.js URL docs](https://nodejs.org/docs/latest/api/url.html#url_class_url).

#### asUrlString()

Verifies that the variable is a valid URL string and returns the validated
string. The validation is performed by passing the URL string to the
[Node.js URL constructor](https://nodejs.org/docs/latest/api/url.html#url_class_url).

Note that URLs without paths will have a default path `/` appended when read, e.g.
`https://api.acme.org` would become `https://api.acme.org/`. Always use URL
safe utilities included in the
[Node.js URL module](https://nodejs.org/docs/latest/api/url.html) to create
valid URL strings, instead of error prone string concatenation.

## EnvVarError()

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

### Examples

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

## accessors

A property that exposes the built-in accessors that this module uses to parse
and validate values. These work similarly to the *asString()* and other
accessors exposed on the *variable* type documented above, however they accept
a *String* as their first argument, e.g:

```js
const env = require('env-var')

// Validate that the string is JSON, and return the parsed result
const myJsonDirectAccessor = env.accessors.asJson(process.env.SOME_JSON)

const myJsonViaEnvVar = env.get('SOME_JSON').asJson()
```

All of the documented *asX()* accessors above are available. These are useful
if you need to build a custom accessor using the *extraAccessors* functionality
described below.

## extraAccessors

When calling `from()` you can also pass an optional parameter containing
additional accessors that will be attached to any variables gotten by that
`env-var` instance.

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

This feature is also available for Typescript users. The `ExtensionFn` type is
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

You can view an example of composing built-in accessors made available by
`env.accessors` in an extra accessor at *examples/custom-accessor.js*.