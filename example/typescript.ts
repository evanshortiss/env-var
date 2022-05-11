
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

// Extension to built-in variable
// Verify this works, and fluid API works with it
class CustomVariable extends env.Variable {
  public asEmail () {
    this.getValue<string>((s) => {
      const split = String(s).split('@')
      if (split.length !== 2) {
        throw new Error('must contain exactly one "@"')
      }
      return s
    })
  }
}
const customEnv = new env.EnvInstance<CustomVariable>({
  container: {
    ADMIN_EMAIL: 'admin@example.com'
  },
  variableClass: CustomVariable
})
const v = customEnv.get('ADMIN')

const adminEmail = customEnv.get('ADMIN_EMAIL')
  .example('someone@example')
  .required()
  .asEmail()

console.log('admin email is:', adminEmail)

const log: env.LoggerFn = (varname, msg) => {
  console.log(`Log for ${varname}: ${msg}`)
}
const loggerEnv = env.from(process.env, {}, log)
console.log(`HOME is set to: ${loggerEnv.get('HOME').asString()}`)
