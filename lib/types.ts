
export type EnvContainer = NodeJS.ProcessEnv
export type EnvLogger = (varname: string, msg: string) => void
export type EnvVarConfig<Container extends NodeJS.ProcessEnv = NodeJS.ProcessEnv> = {
  container: Container
  // variableClass?: { new(...args: any[]): ExtendedVariable },
  logger?: EnvLogger
}
export type EnvVarInstance<Container extends NodeJS.ProcessEnv> = {
  from: fromFn,
  get: (variable?: keyof Container) => Container
}

type fromFn = <T extends NodeJS.ProcessEnv>(config: EnvVarConfig) => EnvVarInstance<T>
export type EnvInstance = {
  from: fromFn
}
