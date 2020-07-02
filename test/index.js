'use strict'

/* eslint-env mocha */

const expect = require('chai').expect
const URL = require('url').URL

describe('env-var', function () {
  // Some default env vars for tests
  var TEST_VARS = {
    VALID_BASE_64: 'aGVsbG8=', // "hello" in base64
    INVALID_BASE_64: 'a|GV-sb*G8=',
    STRING: 'oh hai',
    FLOAT: '12.43',
    INTEGER: '5',
    BOOL: 'false',
    JSON: '{"name":"value"}',
    JSON_OBJECT: '{"name":"value"}',
    JSON_ARRAY: '[1,2,3]',
    COMMA_ARRAY: '1,2,3',
    EMPTY_ARRAY: '',
    ARRAY_WITHOUT_DELIMITER: 'value',
    ARRAY_WITH_DELIMITER: 'value,',
    ARRAY_WITH_DELIMITER_PREFIX: ',value',
    DASH_ARRAY: '1-2-3',
    URL: 'http://google.com/',
    ENUM: 'VALID',
    EMPTY_STRING: '',
    EMPTY_STRING_WITH_WHITESPACE: '  '
  }

  var mod = require('../env-var.js')

  beforeEach(function () {
    // Inject our dummy vars
    Object.keys(TEST_VARS).forEach(function (key) {
      process.env[key] = TEST_VARS[key]
    })
  })

  describe('getting process.env', function () {
    it('should return process.env object when no args provided', function () {
      var res = mod.get()

      expect(res).to.be.an('object');

      ['STRING', 'FLOAT', 'INTEGER', 'BOOL', 'JSON'].forEach(function (name) {
        expect(res[name]).to.not.equal(undefined)
      })
    })
  })

  describe('#get(target, default) deprecation message', () => {
    it('should throw an error if using pre 6.x syntax', () => {
      expect(() => {
        mod.get('SOMETHING', 'default somthing value').asString()
      }).to.throw('env-var: It looks like you passed more than one argument to env.get(). Since env-var@6.0.0 this is no longer supported. To set a default value use env.get(TARGET).default(DEFAULT)')
    })
  })

  describe('default values', function () {
    it('should return the default empty string value', () => {
      const ret = mod.get('XXX_NOT_DEFINED').default('').asString()

      expect(ret).to.equal('')
    })

    it('should return the default', function () {
      const ret = mod.get('XXX_NOT_DEFINED').default('default').asString()

      expect(ret).to.equal('default')
    })

    it('should support passing a number type', () => {
      expect(mod.get('MISSING_NO').default(42).asString()).to.equal('42')
    })

    it('should support passing a number type and returning as a number', () => {
      expect(mod.get('MISSING_NO').default(42).asIntPositive()).to.equal(42)
    })

    it('should support passing objects', () => {
      const tpl = {
        name: 'ok'
      }
      expect(mod.get('MISSING_OBJECT').default(tpl).asJsonObject()).to.deep.equal(tpl)
    })

    it('should support passing arrays', () => {
      const tpl = [1, 2, 3]
      expect(mod.get('MISSING_ARRAY').default(tpl).asJsonArray()).to.deep.equal(tpl)
    })

    it('should error on null', () => {
      expect(() => {
        expect(mod.get('MISSING_NULL_DEFAULT').default(null).asJsonArray())
      }).to.throw('env-var: values passed to default() must be of Number, String, Array, or Object type')
    })
  })

  describe('#convertFromBase64', function () {
    it('should return a value from a converted base64 string', function () {
      const res = mod.get('VALID_BASE_64').convertFromBase64().asString()

      expect(res).to.be.a('string')
      expect(res).to.equal('hello')
    })

    it('should throw an error due to malformed base64', function () {
      expect(() => {
        mod.get('INVALID_BASE_64').convertFromBase64().asString()
      }).throw(/"INVALID_BASE_64" should be a valid base64 string if using convertFromBase64/g)
    })
  })

  describe('#asEnum', function () {
    it('should return a string', function () {
      expect(mod.get('ENUM').asEnum(['VALID'])).to.be.a('string')
      expect(mod.get('ENUM').asEnum(['VALID'])).to.equal('VALID')
    })

    it('should throw when value is not expected', function () {
      expect(() => {
        expect(mod.get('ENUM').asEnum(['INVALID']))
      }).to.throw('env-var: "ENUM" should be one of [INVALID]')
    })
  })

  describe('#asString', function () {
    it('should return a string', function () {
      expect(mod.get('STRING').asString()).to.be.a('string')
      expect(mod.get('STRING').asString()).to.equal(TEST_VARS.STRING)
    })
  })

  describe('#asUrlString', function () {
    it('should return a url string', function () {
      expect(mod.get('URL').asUrlString()).to.be.a('string')
      expect(mod.get('URL').asUrlString()).to.equal(TEST_VARS.URL)
    })

    it('should throw due to bad url', function () {
      process.env.URL = 'not a url'

      expect(() => {
        mod.get('URL').asUrlString()
      }).to.throw('env-var: "URL" should be a valid URL')
    })
  })

  describe('#asUrlObject', function () {
    it('should return a url object', function () {
      expect(mod.get('URL').asUrlObject()).to.be.an.instanceOf(URL)
    })

    it('should throw due to bad url', function () {
      process.env.URL = 'not a url'

      expect(() => {
        mod.get('URL').asUrlObject()
      }).to.throw('env-var: "URL" should be a valid URL')
    })
  })

  describe('#asInt', function () {
    it('should return an integer', function () {
      expect(mod.get('INTEGER').asInt()).to.be.a('number')
      expect(mod.get('INTEGER').asInt()).to.equal(parseInt(TEST_VARS.INTEGER))
    })

    it('should throw an exception - non integer type found', function () {
      process.env.INTEGER = '1.2'

      expect(function () {
        mod.get('INTEGER').asInt()
      }).to.throw()
    })

    it('should throw an exception - non integer type found', function () {
      process.env.INTEGER = 'nope'

      expect(function () {
        mod.get('INTEGER').asInt()
      }).to.throw()
    })
  })

  describe('#asIntPositive', function () {
    it('should return a positive integer', function () {
      expect(mod.get('INTEGER').asIntPositive()).to.be.a('number')
      expect(mod.get('INTEGER').asIntPositive()).to.equal(parseInt(TEST_VARS.INTEGER))
    })

    it('should throw an exception - negative integer found', function () {
      process.env.INTEGER = '-10'

      expect(function () {
        mod.get('INTEGER').asIntPositive()
      }).to.throw()
    })
  })

  describe('#asIntNegative', function () {
    it('should return a negative integer', function () {
      process.env.INTEGER = '-10'
      expect(mod.get('INTEGER').asIntNegative()).to.be.a('number')
      expect(mod.get('INTEGER').asIntNegative()).to.equal(parseInt(-10))
    })

    it('should throw an exception - positive integer found', function () {
      expect(function () {
        mod.get('INTEGER').asIntNegative()
      }).to.throw()
    })
  })

  describe('#asFloat', function () {
    it('should return a float', function () {
      expect(mod.get('FLOAT').asFloat()).to.be.a('number')
      expect(mod.get('FLOAT').asFloat()).to.equal(parseFloat(TEST_VARS.FLOAT))
    })

    it('should throw an exception - non float found', function () {
      process.env.FLOAT = 'nope'

      expect(function () {
        mod.get('FLOAT').asFloat()
      }).to.throw()
    })
  })

  describe('#asFloatPositive', function () {
    it('should return a positive float', function () {
      expect(mod.get('FLOAT').asFloatPositive()).to.be.a('number')
      expect(mod.get('FLOAT').asFloatPositive()).to.equal(parseFloat(TEST_VARS.FLOAT))
    })

    it('should throw an exception - negative integer found', function () {
      process.env.FLOAT = `-${process.env.FLOAT}`

      expect(function () {
        mod.get('FLOAT').asFloatPositive()
      }).to.throw()
    })
  })

  describe('#asFloatNegative', function () {
    it('should return a negative float', function () {
      const numberString = `-${TEST_VARS.FLOAT}`
      process.env.FLOAT = numberString
      expect(mod.get('FLOAT').asFloatNegative()).to.be.a('number')
      expect(mod.get('FLOAT').asFloatNegative()).to.equal(parseFloat(numberString))
    })

    it('should throw an exception - positive integer found', function () {
      expect(function () {
        mod.get('FLOAT').asFloatNegative()
      }).to.throw()
    })
  })

  describe('#asBool', function () {
    it('should return a bool - for string "false"', function () {
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(false)
    })

    it('should return a bool - for string "FALSE"', function () {
      process.env.BOOL = 'FALSE'
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(false)
    })

    it('should return a bool - for string "0"', function () {
      process.env.BOOL = '0'
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(false)
    })

    it('should return a bool - for integer 0', function () {
      process.env.BOOL = 0
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(false)
    })

    it('should return a bool - for string "true"', function () {
      process.env.BOOL = 'true'
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(true)
    })

    it('should return a bool - for string "TRUE"', function () {
      process.env.BOOL = 'TRUE'
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(true)
    })

    it('should return a bool - for string "1"', function () {
      process.env.BOOL = '1'
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(true)
    })

    it('should return a bool - for integer 1', function () {
      process.env.BOOL = 1
      expect(mod.get('BOOL').asBool()).to.be.a('boolean')
      expect(mod.get('BOOL').asBool()).to.equal(true)
    })

    it('should throw an exception - invalid boolean found', function () {
      process.env.BOOL = 'nope'

      expect(function () {
        mod.get('BOOL').asBool()
      }).to.throw()
    })
  })

  describe('#asBoolStrict', function () {
    it('should return a bool - for string "false"', function () {
      expect(mod.get('BOOL').asBoolStrict()).to.be.a('boolean')
      expect(mod.get('BOOL').asBoolStrict()).to.equal(false)
    })

    it('should return a bool - for string "FALSE"', function () {
      process.env.BOOL = 'FALSE'
      expect(mod.get('BOOL').asBoolStrict()).to.be.a('boolean')
      expect(mod.get('BOOL').asBoolStrict()).to.equal(false)
    })

    it('should throw an exception - for string "0"', function () {
      process.env.BOOL = '0'

      expect(function () {
        mod.get('BOOL').asBoolStrict()
      }).to.throw()
    })

    it('should throw an exception - for integer 0', function () {
      process.env.BOOL = 0

      expect(function () {
        mod.get('BOOL').asBoolStrict()
      }).to.throw()
    })

    it('should return a bool - for string "true"', function () {
      process.env.BOOL = 'true'
      expect(mod.get('BOOL').asBoolStrict()).to.be.a('boolean')
      expect(mod.get('BOOL').asBoolStrict()).to.equal(true)
    })

    it('should return a bool - for string "TRUE"', function () {
      process.env.BOOL = 'TRUE'
      expect(mod.get('BOOL').asBoolStrict()).to.be.a('boolean')
      expect(mod.get('BOOL').asBoolStrict()).to.equal(true)
    })

    it('should throw an exception - for string "1"', function () {
      process.env.BOOL = '1'

      expect(function () {
        mod.get('BOOL').asBoolStrict()
      }).to.throw()
    })

    it('should throw an exception - for integer 1', function () {
      process.env.BOOL = 1

      expect(function () {
        mod.get('BOOL').asBoolStrict()
      }).to.throw()
    })

    it('should throw an exception - invalid boolean found', function () {
      process.env.BOOL = 'nope'

      expect(function () {
        mod.get('BOOL').asBoolStrict()
      }).to.throw()
    })
  })

  describe('#asJson', function () {
    it('should return a json object', function () {
      expect(mod.get('JSON').asJson()).to.be.an('object')
      expect(mod.get('JSON').asJson()).to.deep.equal(JSON.parse(TEST_VARS.JSON))
    })

    it('should throw an exception - json parsing failed', function () {
      process.env.JSON = '{ nope}'

      expect(function () {
        mod.get('JSON').asJson()
      }).to.throw()
    })
  })

  describe('#required', function () {
    it('should not throw if required and found', function () {
      expect(mod.get('JSON').required().asJson()).to.be.an('object')
    })

    it('should not throw if required is passed a false argument', function () {
      delete process.env.JSON

      expect(mod.get('JSON').required(false).asJson()).to.equal(undefined)
    })

    it('should throw an exception when required, but not set', function () {
      delete process.env.JSON

      expect(function () {
        mod.get('JSON').required().asJson()
      }).to.throw()
    })

    it('should throw an exception when required and set, but empty', function () {
      expect(function () {
        mod.get('EMPTY_STRING').required().asString()
      }).to.throw()

      expect(function () {
        mod.get('EMPTY_STRING_WITH_WHITESPACE').required().asString()
      }).to.throw()
    })

    it('should throw an exception when required, set, empty and empty default value', function () {
      expect(function () {
        mod.get('EMPTY_STRING').default('').required().asString()
      }).to.throw()
    })

    it('should not throw if required, set, empty but has a default value', function () {
      expect(mod.get('XXX_NOT_DEFINED').default('default').required().asString()).to.equal('default')
    })

    it('should return undefined when not set and not required', function () {
      delete process.env.STRING

      expect(mod.get('STRING').asString()).to.equal(undefined)
    })
  })

  describe('#asJsonArray', function () {
    it('should return undefined', function () {
      expect(
        mod.get('nope').asJsonArray()
      ).to.equal(undefined)
    })

    it('should throw an error - value was an object', function () {
      expect(function () {
        mod.get('JSON_OBJECT').asJsonArray()
      }).to.throw()
    })

    it('should return a JSON Array', function () {
      expect(
        mod.get('JSON_ARRAY').asJsonArray()
      ).to.deep.equal([1, 2, 3])
    })
  })

  describe('#asJsonObject', function () {
    it('should throw an exception', function () {
      expect(
        mod.get('nope').asJsonObject()
      ).to.equal(undefined)
    })

    it('should throw an error - value was an array', function () {
      expect(function () {
        mod.get('JSON_ARRAY').asJsonObject()
      }).to.throw()
    })

    it('should return a JSON Object', function () {
      expect(
        mod.get('JSON_OBJECT').asJsonObject()
      ).to.deep.equal({ name: 'value' })
    })
  })

  describe('#asArray', function () {
    it('should return undefined when not set', function () {
      expect(mod.get('.NOPE.').asArray()).to.equal(undefined)
    })

    it('should return an array that was split on commas', function () {
      expect(mod.get('COMMA_ARRAY').asArray()).to.deep.equal(['1', '2', '3'])
    })

    it('should return an array that was split on dashes', function () {
      expect(mod.get('DASH_ARRAY').asArray('-')).to.deep.equal(['1', '2', '3'])
    })

    it('should return an empty array if empty env var was set', function () {
      expect(mod.get('EMPTY_ARRAY').asArray()).to.deep.equal([])
    })

    it('should return array with only one value if env var doesn\'t contain delimiter', function () {
      expect(mod.get('ARRAY_WITHOUT_DELIMITER').asArray()).to.deep.equal(['value'])
    })

    it('should return array with only one value if env var contain delimiter', function () {
      expect(mod.get('ARRAY_WITH_DELIMITER').asArray()).to.deep.equal(['value'])
    })

    it('should return array with only one value if env var contain delimiter as prefix', function () {
      expect(mod.get('ARRAY_WITH_DELIMITER_PREFIX').asArray()).to.deep.equal(['value'])
    })
  })

  describe('#asPortNumber', function () {
    it('should raise an error for ports less than 0', function () {
      process.env.PORT_NUMBER = '-2'

      expect(function () {
        mod.get('PORT_NUMBER').asPortNumber()
      }).to.throw('should be a positive integer')
    })
    it('should raise an error for ports greater than 65535', function () {
      process.env.PORT_NUMBER = '700000'

      expect(function () {
        mod.get('PORT_NUMBER').asPortNumber()
      }).to.throw('cannot assign a port number greater than 65535')
    })

    it('should return a number for valid ports', function () {
      process.env.PORT_NUMBER = '8080'

      expect(mod.get('PORT_NUMBER').asPortNumber()).to.equal(8080)
    })
  })

  describe('#asRegExp', function () {
    it('should raise an error for invalid regular expressions', function () {
      process.env.REG_EXP = '*'

      expect(function () {
        mod.get('REG_EXP').asRegExp()
      }).to.throw('should be a valid regexp')
    })

    it('should raise an error for invalid flags', function () {
      process.env.REG_EXP = '^valid$'

      expect(function () {
        mod.get('REG_EXP').asRegExp('ii')
      }).to.throw('invalid regexp flags')
    })

    it('should return a RegExp object for valid regular expressions', function () {
      process.env.REG_EXP = '^valid$'

      const regExp = mod.get('REG_EXP').asRegExp()

      expect(Object.prototype.toString.call(regExp)).to.equal('[object RegExp]')
      expect(regExp.toString()).to.equal('/^valid$/')
    })

    it('should accept a flag argument to be passed along as the second argument to the RegExp constructor', function () {
      process.env.REG_EXP = '^valid$'

      expect(mod.get('REG_EXP').asRegExp('i').flags).to.equal('i')
    })
  })

  describe('#example', () => {
    let fromMod

    beforeEach(() => {
      fromMod = mod.from({
        JSON_CONFIG: '{1,2]'
      })
    })

    const sampleConfig = JSON.stringify({
      maxConnections: 10,
      enableSsl: true
    })

    it('should throw an error with a valid example message', () => {
      expect(() => {
        fromMod.get('JSON_CONFIG').example(sampleConfig).asJsonArray()
      }).to.throw(`env-var: "JSON_CONFIG" should be valid (parseable) JSON. An example of a valid value would be: ${sampleConfig}`)
    })

    it('should throw an error with a valid example message', () => {
      expect(() => {
        fromMod.get('MISSING_JSON_CONFIG').required().example('[1,2,3]').asJsonArray()
      }).to.throw('env-var: "MISSING_JSON_CONFIG" is a required variable, but it was not set. An example of a valid value would be: [1,2,3]')
    })
  })

  describe('#from', function () {
    var fromMod

    beforeEach(function () {
      fromMod = mod.from({
        A_BOOL: 'true',
        A_STRING: 'blah'
      })
    })

    it('should send messages to the custom logger', () => {
      let spyCallCount = 0
      const data = {
        JSON: JSON.stringify({ name: 'env-var' })
      }

      const env = mod.from(data, {}, (str) => {
        expect(str).to.be.a('string')
        spyCallCount++
      })

      const result = env.get('JSON').asJson()

      expect(result).to.deep.equal({ name: 'env-var' })
      expect(spyCallCount).to.be.greaterThan(0)
    })

    it('should get a from boolean', function () {
      expect(fromMod.get('A_BOOL').required().asBool()).to.eql(true)
    })

    it('should get a from string', function () {
      expect(fromMod.get('A_STRING').required().asString()).to.eql('blah')
    })

    it('should get undefined for a missing un-required value', function () {
      expect(fromMod.get('DONTEXIST').asString()).to.eql(undefined)
    })

    it('should throw an exception on a missing required value', function () {
      expect(function () {
        fromMod.get('DONTEXIST').required().asJson()
      }).to.throw()
    })

    it('should return the from values object if no arguments', function () {
      expect(fromMod.get()).to.have.property('A_BOOL', 'true')
      expect(fromMod.get()).to.have.property('A_STRING', 'blah')
    })

    describe('#extraAccessors', function () {
      it('should add custom accessors to subsequent gotten values', function () {
        const fromMod = mod.from({ STRING: 'Hello, world!' }, {
          asShout: function (value) {
            return value.toUpperCase()
          }
        })

        var gotten = fromMod.get('STRING')

        expect(gotten).to.have.property('asShout')
        expect(gotten.asShout()).to.equal('HELLO, WORLD!')
      })

      it('should allow overriding existing accessors', function () {
        const fromMod = mod.from({ STRING: 'Hello, world!' }, {
          asString: function (value) {
            // https://stackoverflow.com/a/959004
            return value.split('').reverse().join('')
          }
        })

        expect(fromMod.get('STRING').asString()).to.equal('!dlrow ,olleH')
      })

      it('should not attach accessors to other env instances', function () {
        const fromMod = mod.from({ STRING: 'Hello, world!' }, {
          asNull: function (value) {
            return null
          }
        })

        var otherMod = mod.from({
          STRING: 'Hola, mundo!'
        })

        expect(fromMod.get('STRING')).to.have.property('asNull')
        expect(otherMod.get('STRING')).not.to.have.property('asNull')
      })
    })

    describe('#accessors', () => {
      describe('#asArray', () => {
        it('should return an array of strings', () => {
          const arr = fromMod.accessors.asArray('1,2,3')

          expect(arr).to.eql(['1', '2', '3'])
        })

        it('should return an array of strings split by period chars', () => {
          const arr = fromMod.accessors.asArray('1.2.3', '.')

          expect(arr).to.eql(['1', '2', '3'])
        })
      })

      describe('#asInt', () => {
        it('should return an integer', () => {
          const ret = fromMod.accessors.asInt('1')

          expect(ret).to.eql(1)
        })
      })
    })

    describe('#logger', () => {
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
    })
  })

  describe('#accessors', () => {
    describe('#asArray', () => {
      it('should return an array of strings', () => {
        const arr = mod.accessors.asArray('1,2,3')

        expect(arr).to.eql(['1', '2', '3'])
      })

      it('should return an array of strings split by period chars', () => {
        const arr = mod.accessors.asArray('1.2.3', '.')

        expect(arr).to.eql(['1', '2', '3'])
      })
    })

    describe('#asInt', () => {
      it('should return an integer', () => {
        const ret = mod.accessors.asInt('1')

        expect(ret).to.eql(1)
      })
    })
  })
})
