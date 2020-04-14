
import * as env from '../../';
import { expect } from 'chai'
import * as url from 'url';
import 'mocha'
import { assert, IsExact } from 'conditional-type-checks'

describe('typescript tests', () => {
  describe('#from', () => {
    it('should return an env-var instance and read with asString()', () => {
      const A_STRING = 'hello, world!'
      const e = env.from({
        A_STRING
      })

      expect(e.get('A_STRING').asString()).to.equal(A_STRING)
    })

    it('should return an env-var instance be missing system vars', () => {
      // env-var instance with no vars
      const e = env.from({})

      expect(e.get('PATH').asString()).to.equal(undefined)
    })
  })

  describe('#accessors', () => {
    it('required().asString() should throw if missing', () => {
      const e = env.from({})

      expect(() => {
        e.get('A_MISSING_VARIABLE').required().asString()
      }).to.throw('env-var: "A_MISSING_VARIABLE" is a required variable, but it was not set')
    })
  })

  describe('#ExtensionFn', () => {
    it('should return the email parts for a valid email, throw for invalid', () => {
      interface EmailComponents {
        username: string
        domain: string
      }

      const asEmailComponents: env.ExtensionFn<EmailComponents> = (value) => {
        const parts = value.split('@')

        if (parts.length != 2) {
          throw new Error('should be an email')
        } else {
          return {
            username: parts[0],
            domain: parts[1]
          }
        }
      }

      const extendedEnv = env.from({
        VALID_EMAIL: 'hello@example.com',
        INVALID_EMAIL: 'oops-example.com'
      }, {
        asEmailComponents
      })

      // We use required() here to verify chaining typings work
      expect(
        extendedEnv.get('VALID_EMAIL').required().asEmailComponents()
      ).to.deep.equal({
        username: 'hello',
        domain: 'example.com'
      })

      expect(() => {
        extendedEnv.get('INVALID_EMAIL').asEmailComponents()
      }).to.throw('env-var: "INVALID_EMAIL" should be an email, but is set to "oops-example.com"')
    })
  })

  describe('asEnum', () => {
    const e = env.from({
      ENUM: 'a'
    })

    it('should work with generic defaults', () => {
      const enums = e.get('ENUM').required().asEnum(['a', 'b'])

      assert<IsExact<typeof enums, 'a' | 'b'>>(true);
    })

    it('should work with generic params', () => {
      const enums = e.get('ENUM').required().asEnum<'a' | 'b'>(['a', 'b'])

      assert<IsExact<typeof enums, 'a' | 'b'>>(true);
    })
  })
})
