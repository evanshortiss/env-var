'use strict'

/* eslint-env mocha */

const { expect } = require('chai')

describe('Logger', () => {
  const varname = 'SOME_VAR'
  const msg = 'this is a test message'

  it('should send a string to the given logger', () => {
    let spyCalled = false
    const spy = (str) => {
      expect(str).to.equal(`env-var (${varname}): ${msg}`)
      spyCalled = true
    }

    const log = require('../lib/logger').createLogger(spy, false)

    log(varname, msg)
    expect(spyCalled).to.equal(true)
    expect(spyCalled)
  })

  it('should not not send a string to the logger since isProduction is set to true', () => {
    let spyCalled = false
    const spy = (str) => {
      spyCalled = true
    }

    const log = require('../lib/logger').createLogger(spy, true)

    log(varname, msg)
    expect(spyCalled).to.equal(false)
  })

  it('should not not send a string to the logger since isProduction is set to true by default', () => {
    let spyCalled = false
    const spy = (str) => {
      spyCalled = true
    }

    const log = require('../lib/logger').createLogger(spy)

    log(varname, msg)
    expect(spyCalled).to.equal(false)
  })

  it('should throw an error due to a non boolean second arg', () => {
    const { createLogger } = require('../')

    expect(() => {
      createLogger((s) => console.log(s), 'production')
    }).to.throw('env-var: The second parameter passed to the createLogger function must be a boolean value')
  })
})
