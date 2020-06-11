'use strict'

/* eslint-env mocha */

const { expect } = require('chai')

describe('#built-in logger', () => {
  const varname = 'SOME_VAR'
  const msg = 'this is a test message'

  it('should send a string to the given logger', () => {
    let spyCalled = false
    const spy = (str) => {
      expect(str).to.equal(`env-var (${varname}): ${msg}`)
      spyCalled = true
    }

    const log = require('../lib/logger')(spy)

    log(varname, msg)
    expect(spyCalled).to.equal(true)
  })

  it('should not not send a string to the logger due to "prod" flag', () => {
    let spyCalled = false
    const spy = (str) => {
      spyCalled = true
    }

    const log = require('../lib/logger')(spy, 'prod')

    log(varname, msg)
    expect(spyCalled).to.equal(false)
  })

  it('should not not send a string to the logger due to "production" flag', () => {
    let spyCalled = false
    const spy = (str) => {
      spyCalled = true
    }

    const log = require('../lib/logger')(spy, 'production')

    log(varname, msg)
    expect(spyCalled).to.equal(false)
  })
})
