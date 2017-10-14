
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
const requiredInt = env.get('AN_INTEGER').required().asInt()

console.log('the integer was', requiredInt)
