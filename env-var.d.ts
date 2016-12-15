
export interface IPresentVariable {
  asFloat: () => number;
  asInt: () => number;
  asPositiveInt: () => number;
  asNegativeInt: () => number;
  asString: () => string;
  asJson: () => Object|Array<any>;
  asBool: () => boolean;
  asStrictBool: () => boolean;
}

export interface IOptionalVariable {
  required: () => IPresentVariable;
  asFloat: () => number|undefined;
  asInt: () => number|undefined;
  asPositiveInt: () => number|undefined;
  asNegativeInt: () => number|undefined;
  asString: () => string|undefined;
  asJson: () => Object|Array<any>|undefined;
  asBool: () => boolean|undefined;
  asStrictBool: () => boolean|undefined;
}

export interface IEnv {
  (): Object,
  (varName: string): IOptionalVariable;
  (varName: string, defaultValue: string): IPresentVariable;
  mock(mockVars: Object): IEnv;
}

export const env: IEnv;
export default env;
