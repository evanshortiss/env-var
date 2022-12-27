'use strict'

/* eslint-env mocha */

const { expect } = require('chai')
const proxyquire = require('proxyquire')

describe('Non Node.js environments', () => {
  it('should throw an error that top-level get() is only supported in Node.js environments', () => {
    const env = proxyquire('../', {
      './lib/check-environment': {
        isNode: () => false
      }
    })

    expect(() => env.get()).to.throw('env-var: The exported get() function is only supported in Node.js environments. For all other environments use from() to create an EnvVarInstance first.')
  })
})
