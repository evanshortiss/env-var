'use strict';

var expect = require('chai').expect;

describe('env-var', function () {
  // Some default env vars for tests
  var TEST_VARS = {
    STRING: 'oh hai',
    FLOAT: '12.43',
    INTEGER: '5',
    BOOL: 'false',
    JSON: '{"name":"value"}'
  };

  var mod;

  beforeEach(function () {
    delete require.cache[require.resolve('../lib/index.js')];
    mod = require('../lib/index.js');

    // Inject our dummy vars
    Object.keys(TEST_VARS).forEach(function (key) {
      process.env[key] = TEST_VARS[key];
    });
  });


  describe('getting process.env', function () {
    it('should return process.env object when no args provided', function () {
      var res = mod();

      expect(res).to.be.an('object');

      ['STRING','FLOAT','INTEGER','BOOL','JSON'].forEach(function (name) {
        expect(res[name]).to.be.defined;
      });
    });
  });

  describe('#asString', function () {
    it('should return a string', function () {
      expect(mod('STRING').asString()).to.be.a('string');
      expect(mod('STRING').asString()).to.equal(TEST_VARS.STRING);
    });
  });

  describe('#asInt', function () {
    it('should return an integer', function () {
      expect(mod('INTEGER').asInt()).to.be.a('number');
      expect(mod('INTEGER').asInt()).to.equal(parseInt(TEST_VARS.INTEGER));
    });

    it('should throw an exception - non integer type found', function () {
      process.env.INTEGER = 'nope';

      expect(function () {
        mod('INTEGER').asInt();
      }).to.throw();
    });
  });

  describe('#asPositiveInt', function () {
    it('should return a positive integer', function () {
      expect(mod('INTEGER').asPositiveInt()).to.be.a('number');
      expect(mod('INTEGER').asPositiveInt()).to.equal(parseInt(TEST_VARS.INTEGER));
    });

    it('should throw an exception - negative integer found', function () {
      process.env.INTEGER = '-10';

      expect(function () {
        mod('INTEGER').asPositiveInt();
      }).to.throw();
    });
  });

  describe('#asNegativeInt', function () {
    it('should return a negative integer', function () {
      process.env.INTEGER = '-10';
      expect(mod('INTEGER').asNegativeInt()).to.be.a('number');
      expect(mod('INTEGER').asNegativeInt()).to.equal(parseInt(-10));
    });

    it('should throw an exception - positive integer found', function () {
      expect(function () {
        mod('INTEGER').asNegativeInt();
      }).to.throw();
    });
  });

  describe('#asFloat', function () {
    it('should return a float', function () {
      expect(mod('FLOAT').asFloat()).to.be.a('number');
      expect(mod('FLOAT').asFloat()).to.equal(parseFloat(TEST_VARS.FLOAT));
    });

    it('should throw an exception - non float found', function () {
      process.env.FLOAT = 'nope';

      expect(function () {
        mod('FLOAT').asFloat();
      }).to.throw();
    });
  });

  describe('#asBool', function () {
    it('should return a bool - for string "false"', function () {
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(false);
    });

    it('should return a bool - for string "FALSE"', function () {
      process.env.BOOL = 'FALSE';
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(false);
    });

    it('should return a bool - for string "0"', function () {
      process.env.BOOL = '0';
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(false);
    });

    it('should return a bool - for integer 0', function () {
      process.env.BOOL = 0;
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(false);
    });

    it('should return a bool - for string "true"', function () {
      process.env.BOOL = 'true';
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(true);
    });

    it('should return a bool - for string "TRUE"', function () {
      process.env.BOOL = 'TRUE';
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(true);
    });

    it('should return a bool - for string "1"', function () {
      process.env.BOOL = '1';
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(true);
    });

    it('should return a bool - for integer 1', function () {
      process.env.BOOL = 1;
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(true);
    });

    it('should throw an exception - invalid boolean found', function () {
      process.env.BOOL = 'nope';

      expect(function () {
        mod('BOOL').asBool();
      }).to.throw();
    });
  });

  describe('#asJson', function () {
    it('should return a json object', function () {
      expect(mod('JSON').asJson()).to.be.an('object');
      expect(mod('JSON').asJson()).to.deep.equal(JSON.parse(TEST_VARS.JSON));
    });

    it('should throw an exception - json parsing failed', function () {
      process.env.JSON = '{ nope}';

      expect(function () {
        mod('JSON').asJson();
      }).to.throw();
    });
  });

  describe('#required', function () {
    it('should not throw if required and found', function () {
      expect(mod('JSON').required().asJson()).to.be.an('object');
    });

    it('should throw an exception when required, but not set', function () {
      delete process.env.JSON;

      expect(function () {
        mod('JSON').required().asJson();
      }).to.throw();
    });

    it('should return undefined when not set and not required', function () {
      delete process.env.STRING;

      expect(mod('STRING').asString()).to.be.undefined;
    });
  });

  describe('#mock', function() {
    var mockMod;

    beforeEach(function() {
      mockMod = mod.mock({
        A_BOOL: 'true',
        A_STRING: 'blah'
      });
    });

    it('Should get a mock boolean', function() {
      expect(mockMod('A_BOOL').required().asBool()).to.eql(true);
    });

    it('Should get a mock string', function() {
      expect(mockMod('A_STRING').required().asString()).to.eql('blah');
    });

    it('Should get undefined for a missing un-required value', function() {
      expect(mockMod('DONTEXIST').asString()).to.eql(undefined);
    });

    it('Should throw an exception on a missing required value', function() {
      expect(function () {
        mockMod('DONTEXIST').required().asJson();
      }).to.throw();
    });

    it('Should return the mock values object if no arguments', function() {
      expect(mockMod()).to.have.property('A_BOOL', 'true');
      expect(mockMod()).to.have.property('A_STRING', 'blah');
    });

  });
});
