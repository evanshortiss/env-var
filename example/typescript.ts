
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

// ExtensionFn - Verify this works, and fluid API works with it
const asEmail: env.ExtensionFn<string> = (value) => {
  const split = String(value).split('@')
  if (split.length !== 2) {
    throw new Error('must contain exactly one "@"')
  }
  return value
}

const customEnv = env.from({
  ADMIN_EMAIL: 'admin@example.com'
}, {
  asEmail
})

const adminEmail = customEnv.get('ADMIN_EMAIL')
  .example('someone@example')
  .required()
  .asEmail()

console.log('admin email is:', adminEmail)
