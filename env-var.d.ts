
interface IPresentVariable {
  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: () => number;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: () => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asPositiveInt: () => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than zero).
   */
  asNegativeInt: () => number;

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
  asStrictBool: () => boolean;
}

interface IOptionalVariable {
  /**
   * Ensure the variable is set on process.env, if not an exception will be thrown.
   */
  required: () => IPresentVariable;

  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: () => number|undefined;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: () => number|undefined;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asPositiveInt: () => number|undefined;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than zero).
   */
  asNegativeInt: () => number|undefined;

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
  asStrictBool: () => boolean|undefined;
}

interface IEnv {
  /**
   * Returns an object containing all current environment variables
   */
  (): {[varName: string]: string},

  /**
   * Gets an environment variable that is possibly not set to a value
   */
  (varName: string): IOptionalVariable;

  /**
   * Gets an environment variable, using the default value if it is not already set
   */
  (varName: string, defaultValue: string): IPresentVariable;

  /**
   * Returns a mock env-var instance, where the given object is used for the environment variable mapping. Use this when writing unit tests.
   */
  mock(mockVars: {[varName: string]: string}): IEnv;
}

declare const env: IEnv;
export = env;
