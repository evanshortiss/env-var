import * as env from '../../';
import { expect } from 'chai';
import 'mocha';
import { assert, IsExact } from 'conditional-type-checks';

describe('typescript tests', () => {
  describe('#from', () => {
    it('should return an env-var instance and read with asString()', () => {
      const A_STRING = 'hello, world!';
      const e = env.from({
        A_STRING,
      });

      expect(e.get('A_STRING').asString()).to.equal(A_STRING);
    });

    it('should return an env-var instance be missing system vars', () => {
      // env-var instance with no vars
      const e = env.from({});

      // @ts-expect-error `PATH` is not in container object
      expect(e.get('PATH').asString()).to.equal(undefined);
    });
  });

  describe('#accessors', () => {
    it('required().asString() should throw if missing', () => {
      const e = env.from({});

      expect(() => {
        // @ts-expect-error `A_MISSING_VARIABLE` is not in container object
        e.get('A_MISSING_VARIABLE').required().asString();
      }).to.throw(
        'env-var: "A_MISSING_VARIABLE" is a required variable, but it was not set'
      );
    });
  });

  describe('#ExtensionFn', () => {
    interface EmailComponents {
      username: string;
      domain: string;
    }
    const asEmailComponents: env.ExtensionFn<EmailComponents> = (value) => {
      const parts = value.split('@');

      if (parts.length != 2) {
        throw new Error('should be an email');
      } else {
        return {
          username: parts[0],
          domain: parts[1],
        };
      }
    };

    it('should return the email parts for a valid email, throw for invalid', () => {
      const extendedEnv = env.from(
        {
          VALID_EMAIL: 'hello@example.com',
          INVALID_EMAIL: 'oops-example.com',
        },
        {
          asEmailComponents,
        }
      );

      // We use required() here to verify chaining typings work
      expect(
        extendedEnv.get('VALID_EMAIL').required().asEmailComponents()
      ).to.deep.equal({
        username: 'hello',
        domain: 'example.com',
      });

      expect(() => {
        extendedEnv.get('INVALID_EMAIL').asEmailComponents();
      }).to.throw('env-var: "INVALID_EMAIL" should be an email');
    });

    it('should support multiple extensions (with correct types)', () => {
      const asNumberZero: env.ExtensionFn<number> = (value) => {
        const n = parseInt(value);

        if (n === 0) {
          return 0;
        }

        throw new env.EnvVarError('was not zero');
      };

      const extendedEnv = env.from(
        {
          EMAIL: 'hello@example.com',
          ZERO: '0',
        },
        {
          asEmailComponents,
          asNumberZero,
        }
      );

      expect(extendedEnv.get('ZERO').required().asNumberZero()).to.equal(0);

      expect(extendedEnv.get('ZERO').asNumberZero()).to.equal(0);

      expect(
        extendedEnv.get('EMAIL').required().asEmailComponents()
      ).to.deep.equal({
        username: 'hello',
        domain: 'example.com',
      });

      expect(extendedEnv.get('EMAIL').asEmailComponents()).to.deep.equal({
        username: 'hello',
        domain: 'example.com',
      });
    });

    it('should carry extension functions to a child with from()', () => {
      const asNumberZero: env.ExtensionFn<number> = (value) => {
        const n = parseInt(value);

        if (n === 0) {
          return 0;
        }

        throw new env.EnvVarError('was not zero');
      };

      const extendedEnvA = env.from({
        ZERO: '0',
      });

      const extendedEnvB = extendedEnvA.from(
        {
          ZERO: '0',
        },
        {
          asNumberZero,
        }
      );

      expect(extendedEnvB.get('ZERO').required().asNumberZero()).to.equal(0);

      expect(extendedEnvB.get('ZERO').asNumberZero()).to.equal(0);
    });
  });

  describe('asEnum', () => {
    const e = env.from({
      ENUM: 'a',
    });

    it('should work with generic defaults', () => {
      const enums = e.get('ENUM').required().asEnum(['a', 'b']);

      assert<IsExact<typeof enums, 'a' | 'b'>>(true);
    });

    it('should work with generic params', () => {
      const enums = e.get('ENUM').required().asEnum<'a' | 'b'>(['a', 'b']);

      assert<IsExact<typeof enums, 'a' | 'b'>>(true);
    });
  });

  describe('asRegExp', () => {
    const e = env.from({
      REG_EXP: '^.*$',
    });

    it('should return a RegExp instance', () => {
      const regExp = e.get('REG_EXP').required().asRegExp();

      assert<IsExact<typeof regExp, RegExp>>(true);
    });

    it('should accept a single string argument for flags', () => {
      e.get('REG_EXP').required().asRegExp('ig');
    });
  });

  describe('env.accessors', () => {
    describe('#asArray', () => {
      it('should return an array of strings', () => {
        const arr = env.accessors.asArray('1,2,3');

        expect(arr).to.eql(['1', '2', '3']);
      });

      it('should return an array of strings split by period chars', () => {
        const arr = env.accessors.asArray('1.2.3', '.');

        expect(arr).to.eql(['1', '2', '3']);
      });
    });

    describe('#asSet', () => {
      it('should return a Set of strings', () => {
        const set = env.accessors.asSet('1,2,3');

        expect(set).to.eql(new Set(['1', '2', '3']));
      });

      it('should return a Set of strings split by period chars', () => {
        const set = env.accessors.asSet('1.2.3', '.');

        expect(set).to.eql(new Set(['1', '2', '3']));
      });
    });

    describe('#asInt', () => {
      it('should return an integer', () => {
        const ret = env.accessors.asInt('1');

        expect(ret).to.eql(1);
      });
    });
  });
});
