## 3.0.0 (13/10/17)
* Public API no longer is a function, instead exposes two functions, `mock` and `get`
* Drop support for Node.js versions less than 4.0
* Rename `asPositiveInt` to `asIntPositive`
* Rename `asNegativeInt` to `asIntNegative`
* Rename `asStrictBool` to `asBoolStrict`
* Add `asFloatPositive` and `asFloatNegative`
* Add `asUrlString` and `asUrlObject`
* Refactor code with consistent errors and structure
* Use `standard` for code quality and formatting

## 2.4.3 (5/04/17)
* Update with build, coverage, and version information badges.

## 2.4.2 (19/12/2016)
* Fix TypeScript definition file

## 2.4.1 (15/12/2016)
* Remove unnecessary code path

## 2.4.0 (15/12/2016)
* Add `asArray([delimeter])` to read environment variables as an array by splitting
the varible string on each instance of _delimeter_;
* Add `asJsonArray()` to read in an environment variable that contains a JSON
Array. Similar to `asJson()`, but ensures the variable is an Array.
* Add `asJsonObject()` to read in an environment variable that contains a JSON
Object. Similar to `asJson()`, but ensures the variable is an Object.

## 2.3.0 & 2.3.1 (12/12/2016)
* Add typings support for TypeScript

## 2.2.0 (28/10/2016)
* Thanks to @itavy for a patch for our _asBool_ parsing and adding the new
_asStrictBool_ function

## 2.1.0 (25/10/2016)
* Added _env.mock_ PR from @MikeyBurkman to improve testability

## 2.0.0 (27/07/2016)
* Add CI process for node 6, 5, 4, and 0.10
* Add chained functions for variable validations
* Add assertions for _required()_ and various type checks, e.g _asPositiveInt(_)
* Remove node 0.8.x support
* Remove old pattern of returning variables directly
* Continue support for defaults from 1.X

## <2.0.0
* Venture forth at thine own risk, for here be dragons
