## Contributing

Thanks for your interest in contributing to the project! 🎉

### General Rules & Tips

There are just a few things to be aware of when making a contribution. If you have trouble meeting these requirements don't be shy about asking for help:

* No contribution is too big or too small. Don't be shy, open an issue and we can discuss it 💬
* Generally, opening an issue before making a PR is a good idea unless your PR is addressing a very clear cut bug 🐛
* Follow the prevailing code-style. A PR that changes indentation, adds extra formatting, etc. won't be merged unless it aligns with the existing code-style 📝
* If you add/change/remove a feature the relevant tests must be updated and the CI build should pass with sufficient code coverage ✅
* Be respectful and follow the code of conduct. If you need a TLDR of the code of conduct it's "treat others with respect" 🙏


### Adding an Accessor

If you want to add a new accessor it's pretty straightforward, and an example is outlined below - just make sure it's a reasonably generic use case!

Start by adding a file to `lib/accessors`, with the name of the type e.g add a
file named `number-zero.js` into that folder and populate it with code
following this structure:

```js
/**
 * Validate that the environment value is an integer and equals zero.
 * This is a strange example, but hopefully demonstrates the idea.
 * @param {String}   environmentValue this is the string from process.env
 */
module.exports = function numberZero (environmentValue) {

  // Your custom code should go here...below code is an example

  const val = parseInt(environmentValue)

  if (val === 0) {
    return ret;
  } else {
    throw new Error('should be zero')
  }
}
```

Next update the `accessors` Object in `getVariableAccessors()` in
`lib/variable.js` to include your new module. The naming convention should be of
the format "asTypeSubtype", so for our `number-zero` example it would be done
like so:

```js
asNumberZero: generateAccessor(container, varName, defValue, require('./accessors/number-zero')),
```

Once you've done that, add some unit tests and use it like so:

```js
// Uses your new function to ensure the SOME_NUMBER is the integer 0
env.get('SOME_NUMBER').asNumberZero()
```
