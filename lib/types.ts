
export type EnvContainer = NodeJS.ProcessEnv
export type EnvLogger = (varname: string, msg: string) => void

export type EnvVarInstance<Container extends NodeJS.ProcessEnv> = {
  from: fromFn,
  get: (variable?: keyof Container) => Container
}

type fromFn = <T = NodeJS.ProcessEnv>(config: EnvVarConfig) => EnvVarInstance<T>
export type EnvInstance = {
  from: fromFn
}
