
import * as env from '../env-var'

// Boolean
const doTheThing = env.get('DO_THE_THING').asBool()

if (doTheThing) {
  console.log('did the thing')
} else {
  console.log('did not do the thing')
}

// URL variables
let url = env.get('THE_URL').asUrlString()

if (!url) {
  url = 'http://google.com'
}

console.log('url is', url)

// Integers
const requiredInt = env.get('AN_INTEGER').default(10).required().asInt()

console.log('the integer was', requiredInt)

// Accessor to built-in variable
const asEmail: env.Accessor<string> = (s, error) => {
  const split = String(s).split('@')
  if (split.length !== 2) {
    throw error('must contain exactly one "@"')
  }
  return s
}

const adminEmail = env.get('ADMIN_EMAIL')
  .example('someone@example')
  .required()
  .usingAccessor(asEmail)

console.log('admin email is:', adminEmail)

const logger: env.EnvLogger = (varname, msg) => {
  console.log(`Log for ${varname}: ${msg}`)
}
const loggerEnv = env.from({
  logger,
  variables: process.env
})
console.log(`HOME is set to: ${loggerEnv.get('HOME').asString()}`)
