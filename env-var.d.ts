
/// <reference types="node" />

import { URL } from 'url';


type PublicAccessors = {
  /**
   * Converts a number to an integer and verifies it's in port ranges 0-65535
   */
  asPortNumber: (input: string) => number

  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: (input: string) => number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asFloatPositive: (input: string) =>  number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is negative (less than or equal to zero).
   */
  asFloatNegative: (input: string) => number;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: (input: string) => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asIntPositive: (input: string) => number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than or equal to zero).
   */
  asIntNegative: (input: string) => number;

  /**
   * Return the variable value as a String. Throws an exception if value is not a String.
   * It's highly unlikely that a variable will not be a String since all process.env entries you set in bash are Strings by default.
   */
  asString: (input: string) =>  string;

  /**
   * Return the variable value as an Email. Throws an exception if value is not an Email.
   */
  asEmailString: (input: string) =>  string;

  /**
   * Attempt to parse the variable to a JSON Object or Array. Throws an exception if parsing fails.
   */
  asJson: (input: string) => Object|Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Array, e.g [1,2].
   */
  asJsonArray: (input: string) => Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Object, e.g {a: 1}.
   */
  asJsonObject: (input: string) => Object;

  /**
   * Reads an environment variable as a string, then splits it on each occurrence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become ['1', '2', '3'].
   */
  asArray: (input: string, delimiter?: string) => Array<string>;

  /**
   * Reads an environment variable as a string, then splits it on each occurrence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become new Set(['1', '2', '3']).
   */
  asSet: (input: string, delimiter?: string) => Set<string>;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true", "false" (upper or lowercase), 0 or 1 to succeed.
   */
  asBool: (input: string) => boolean;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true" or "false" (upper or lowercase) to succeed.
   */
  asBoolStrict: (input: string) => boolean;

  /**
   * Verifies that the variable is a valid URL string and returns the validated
   * string. The validation is performed by passing the URL string to the
   * Node.js URL constructor.
   *
   * Note that URLs without paths will have a default path `/` appended when read, e.g.
   * `https://api.acme.org` would become `https://api.acme.org/`. Always use URL
   * safe utilities included in the Node.js URL module to create
   * valid URL strings, instead of error prone string concatenation.
   */
  asUrlString: (input: string) => string;

  /**
   * Verifies that the variable is a valid URL string using the same method as
   * `asUrlString()`, but instead returns the resulting URL instance.
   */
  asUrlObject: (input: string) => URL;

  /**
   * Verifies that the var being accessed is one of the given values
   */
  asEnum: <T extends string>(input: string, validValues: readonly T[]|T[]) =>  T;
}

interface VariableAccessors <AlternateType = unknown> {
  /**
   * Converts a number to an integer and verifies it's in port ranges 0-65535
   */
  asPortNumber: () => AlternateType extends undefined ? undefined|number : number

  /**
   * Attempt to parse the variable to a float. Throws an exception if parsing fails.
   */
  asFloat: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asFloatPositive: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Performs the same task as asFloat(), but also verifies that the number is negative (less than or equal to zero).
   */
  asFloatNegative: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Attempt to parse the variable to an integer. Throws an exception if parsing fails.
   * This is a strict check, meaning that if the process.env value is 1.2, an exception will be raised rather than rounding up/down.
   */
  asInt: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is positive (greater than or equal to zero).
   */
  asIntPositive: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Performs the same task as asInt(), but also verifies that the number is negative (less than or equal to zero).
   */
  asIntNegative: () => AlternateType extends undefined ? undefined|number : number;

  /**
   * Return the variable value as a String. Throws an exception if value is not a String.
   * It's highly unlikely that a variable will not be a String since all process.env entries you set in bash are Strings by default.
   */
  asString: () => AlternateType extends undefined ? undefined|string : string;

  /**
   * Return the variable value as an Email. Throws an exception if value is not an Email.
   */
  asEmailString: () => AlternateType extends undefined ? undefined|string : string;

  /**
   * Attempt to parse the variable to a JSON Object or Array. Throws an exception if parsing fails.
   */
  asJson: () => AlternateType extends undefined ? undefined|Object|Array<any> : Object|Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Array, e.g [1,2].
   */
  asJsonArray: () => AlternateType extends undefined ? undefined|Array<any> : Array<any>;

  /**
   * The same as asJson but checks that the data is a JSON Object, e.g {a: 1}.
   */
  asJsonObject: () => AlternateType extends undefined ? undefined|Object : Object;

  /**
   * Reads an environment variable as a string, then splits it on each occurrence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become ['1', '2', '3'].
   */
  asArray: (delimiter?: string) => AlternateType extends undefined ? undefined|Array<string> : Array<string>;

  /**
   * Reads an environment variable as a string, then splits it on each occurrence of the specified delimiter.
   * By default a comma is used as the delimiter. For example a var set to "1,2,3" would become new Set(['1', '2', '3']).
   */
  asSet: (delimiter?: string) => AlternateType extends undefined ? undefined|Set<string> : Set<string>;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true", "false" (upper or lowercase), 0 or 1 to succeed.
   */
  asBool: () => AlternateType extends undefined ? undefined|boolean : boolean;

  /**
   * Attempt to parse the variable to a Boolean. Throws an exception if parsing fails.
   * The var must be set to either "true" or "false" (upper or lowercase) to succeed.
   */
  asBoolStrict: () => AlternateType extends undefined ? undefined|boolean : boolean;

  /**
   * Verifies that the variable is a valid URL string and returns the validated
   * string. The validation is performed by passing the URL string to the
   * Node.js URL constructor.
   *
   * Note that URLs without paths will have a default path `/` appended when read, e.g.
   * `https://api.acme.org` would become `https://api.acme.org/`. Always use URL
   * safe utilities included in the Node.js URL module to create
   * valid URL strings, instead of error prone string concatenation.
   */
  asUrlString: () => AlternateType extends undefined ? undefined|string : string;

  /**
   * Verifies that the variable is a valid URL string using the same method as
   * `asUrlString()`, but instead returns the resulting URL instance.
   */
  asUrlObject: () => AlternateType extends undefined ? undefined|URL : URL;

  /**
   * Verifies that the var being accessed is one of the given values
   */
  asEnum: <T extends string>(validValues: readonly T[]|T[]) => AlternateType extends undefined ? undefined|T : T;

  /**
   * Verifies that the variable is a valid regular expression and returns the
   * validated expression as a RegExp instance.
   */
  asRegExp: (flags?: string) => AlternateType extends undefined ? undefined|RegExp : RegExp;
}

interface IPresentVariable<Exs extends Extensions = {}> extends VariableAccessors {
  /**
   * Converts a bas64 environment variable to ut8
   */
  convertFromBase64: () => IPresentVariable<Exs> & ExtenderType<Exs>

  /**
   * Provide an example value that can be used in error output if the variable
   * is not set, or is set to an invalid value
   */
  example: (example: string) => IPresentVariable<Exs> & ExtenderType<Exs>

  /**
   * Set a default value for this variable. This will be used if a value is not
   * set in the process environment
   */
  default: (value: string|number|Record<string, any>|Array<any>) => IPresentVariable<Exs> & ExtenderType<Exs>;

  /**
   * Ensures the variable is set on process.env. If it's not set an exception
   * will be thrown. Can pass false to bypass the check.
   */
  required: (isRequired?: boolean) => IPresentVariable & ExtenderType<Exs>;
}

interface IOptionalVariable<Exs extends Extensions = {}> extends VariableAccessors<undefined> {
  /**
   * Decodes a base64-encoded environment variable
   */
  convertFromBase64: () => IOptionalVariable<Exs> & ExtenderTypeOptional<Exs>;

  /**
   * Provide an example value that can be used in error output if the variable
   * is not set, or is set to an invalid value
   */
  example: (value: string) => IOptionalVariable<Exs> & ExtenderTypeOptional<Exs>;

  /**
   * Set a default value for this variable. This will be used if a value is not
   * set in the process environment
   */
  default: (value: string|number|Record<string, any>|Array<any>) => IPresentVariable<Exs> & ExtenderType<Exs>;

  /**
   * Ensures the variable is set on process.env. If it's not set an exception will be thrown.
   * Can pass false to bypass the check
   */
  required: (isRequired?: boolean) => IPresentVariable & ExtenderType<Exs>;
}

export class EnvVarError extends Error {}

interface IEnv<OptionalVariable, Container> {
  /**
   * Returns an object containing all current environment variables
   */
  get (): Container,

  /**
   * Gets an environment variable that is possibly not set to a value
   */
  get (varName: keyof Container): OptionalVariable;

  /**
   * Returns a new env-var instance, where the given object is used for the environment variable mapping.
   * Use this when writing unit tests or in environments outside node.js.
   */
  from<V, T extends Extensions>(values: V, extensions?: T, logger?: LoggerFn): IEnv<
    IOptionalVariable<T> & ExtenderTypeOptional<T>, 
    V
  >;

  accessors: PublicAccessors

  /**
   * This is the error type used to represent error returned by this module.
   * Useful for filtering errors and responding appropriately.
   */
  EnvVarError: EnvVarError
}

// Used internally only to support extension fns
type RestParams<F extends (...args: any[]) => any> = F extends (value: string, ...args: infer P) => any ? P : any[];
type ExtenderType<T extends Extensions> = { [P in keyof T]: (...args: RestParams<T[P]>) => ReturnType<T[P]> }
type ExtenderTypeOptional<T extends Extensions> = { [P in keyof T]: (...args: RestParams<T[P]>) => ReturnType<T[P]>|undefined }

export type Extensions = {
  [key: string]: ExtensionFn<any>
}

export type LoggerFn = (varname: string, str: string) => void
export type RaiseErrorFn = (error: string) => void
export type ExtensionFn<T> = (value: string, ...args: any[]) => T

export const accessors: PublicAccessors

export function logger (varname: string, str: string): void

type IDefaultEnv = IEnv<IOptionalVariable, NodeJS.ProcessEnv>
export const get: IDefaultEnv['get']
export const from: IDefaultEnv['from']
