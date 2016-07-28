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
    it('should return the entire env object', function () {
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

    it('should throw an exception', function () {
      process.env.INTEGER = 'nope';

      expect(function () {
        mod('INTEGER').asInt();
      }).to.throw();
    });
  });

  describe('#asFloat', function () {
    it('should return a float', function () {
      expect(mod('FLOAT').asFloat()).to.be.a('number');
      expect(mod('FLOAT').asFloat()).to.equal(parseFloat(TEST_VARS.FLOAT));
    });

    it('should throw an exception', function () {
      process.env.FLOAT = 'nope';

      expect(function () {
        mod('FLOAT').asFloat();
      }).to.throw();
    });
  });

  describe('#asBool', function () {
    it('should return a bool', function () {
      expect(mod('BOOL').asBool()).to.be.a('boolean');
      expect(mod('BOOL').asBool()).to.equal(Boolean(TEST_VARS.BOOL));
    });

    it('should throw an exception', function () {
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

    it('should throw an exception', function () {
      process.env.JSON = '{ nope}';

      expect(function () {
        mod('JSON').asJson();
      }).to.throw();
    });
  });

  describe('#required', function () {
    it('should not throw', function () {
      expect(mod('JSON').required().asJson()).to.be.an('object');
    });

    it('should throw an exception', function () {
      delete process.env.JSON;

      expect(function () {
        mod('JSON').required().asJson();
      }).to.throw();
    });
  });
});
