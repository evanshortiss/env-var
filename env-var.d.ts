
/// <reference types="node" />

import { Url } from 'url';

interface IPresentVariable {
  /**
   * Converts a bas64 environment variable to ut8
   */
  convertFromBase64: () => IPresentVariable

  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: () => number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is positive (greater than zero).
   */
  asFloatPositive: () => number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is negative (less than zero).
   */
  asFloatNegative: () => number;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: () => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than zero).
   */
  asIntPositive: () => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than zero).
   */
  asIntNegative: () => number;

  /**
   * Return the variable value as a String. Throws an exception if value is not a String.
   * It's highly unlikely that a variable will not be a String since all process.env entries you set in bash are Strings by default.
   */
  asString: () => string;

  /**
   * Attempt to parse the variable to a JSON Object or Array. Throws an exception if parsing fails.
   */
  asJson: () => Object|Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Array, e.g [1,2].
   */
  asJsonArray: () => Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Object, e.g {a: 1}.
   */
  asJsonObject: () => Object;

  /**
   * Reads an environment variable as a string, then splits it on each occurence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become ['1', '2', '3'].
   */
  asArray: (delimiter?: string) => Array<string>;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true", "false" (upper or lowercase), 0 or 1 to succeed.
   */
  asBool: () => boolean;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true" or "false" (upper or lowercase) to succeed.
   */
  asBoolStrict: () => boolean;

  /**
   * Verifies that the environment variable being accessed is a valid URL and
   * returns it as a string. Uses the "is-url" module
   */
  asUrlString: () => string;

  /**
   * Verifies that the environment variable being accessed is a valid URL and
   * returns it as a core URL object. Uses the "is-url" module.
   */
  asUrlObject: () => Url;

  /**
   * Verifies that the var being accessed is one of the given values
   */
  asEnum: (validValues: string[]) => string;
}

interface IOptionalVariable {
  /**
   * Converts a bas64 environment variable to ut8
   */
  convertFromBase64: () => IOptionalVariable

  /**
   * Ensure the variable is set on process.env, if not an exception will be thrown.
   */
  required: () => IPresentVariable;

  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: () => number|undefined;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is positive (greater than zero).
   */
  asFloatPositive: () => number|undefined;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is negative (less than zero).
   */
  asFloatNegative: () => number|undefined;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: () => number|undefined;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than zero).
   */
  asIntPositive: () => number|undefined;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than zero).
   */
  asIntNegative: () => number|undefined;

  /**
   * Return the variable value as a String. Throws an exception if value is not a String.
   * It's highly unlikely that a variable will not be a String since all process.env entries you set in bash are Strings by default.
   */
  asString: () => string|undefined;

  /**
   * Attempt to parse the variable to a JSON Object or Array. Throws an exception if parsing fails.
   */
  asJson: () => Object|Array<any>|undefined;

  /**
   * The same as asJson but checks that the data is a JSON Array, e.g [1,2].
   */
  asJsonArray: () => Array<any>|undefined;

  /**
   * The same as asJson but checks that the data is a JSON Object, e.g {a: 1}.
   */
  asJsonObject: () => Object|undefined;

  /**
   * Reads an environment variable as a string, then splits it on each occurence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become ['1', '2', '3'].
   */
  asArray: (delimiter?: string) => Array<string>|undefined;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true", "false" (upper or lowercase), 0 or 1 to succeed.
   */
  asBool: () => boolean|undefined;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true" or "false" (upper or lowercase) to succeed.
   */
  asBoolStrict: () => boolean|undefined;

  /**
   * Verifies that the environment variable being accessed is a valid URL and
   * returns it as a string. Uses the "is-url" module
   */
  asUrlString: () => string|undefined;

  /**
   * Verifies that the environment variable being accessed is a valid URL and
   * returns it as a core URL object. Uses the "is-url" module.
   */
  asUrlObject: () => Url|undefined;

  /**
   * Verifies that the var being accessed is one of the given values
   */
  asEnum: (validValues: string[]) => string|undefined;
}

declare class EnvVarError extends Error {}

interface IEnv {
  /**
   * Returns an object containing all current environment variables
   */
  get (): {[varName: string]: string},

  /**
   * Gets an environment variable that is possibly not set to a value
   */
  get (varName: string): IOptionalVariable;

  /**
   * Gets an environment variable, using the default value if it is not already set
   */
  get (varName: string, defaultValue: string): IPresentVariable;

  /**
   * Returns a mock env-var instance, where the given object is used for the environment variable mapping.
   * Use this when writing unit tests.
   */
  mock(mockVars: {[varName: string]: string}): IEnv;

  /**
   * This is the error type used to represent error returned by this module.
   * Useful for filtering errors and responding appropriately.
   */
  EnvVarError: EnvVarError
}

declare const env: IEnv;
export = env;
