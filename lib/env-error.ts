// The following line is a bit of a hack to fix a code coverage issue. The
// _extends polyfill added by TypeScript to support ES5 was lowering coverage.
/* istanbul ignore next */

/**
 * Custom error class that can be used to identify errors generated
 * by the module
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */
export class EnvVarError extends Error {
  constructor (message: string) {
    super(`env-var: ${message}`)

    /* istanbul ignore else */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvVarError)
    }

    this.name = 'EnvVarError'
  }
}
