# env-var

<div align="center">

[![NPM version](https://img.shields.io/npm/v/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![TypeScript](https://badgen.net/npm/types/env-var)](http://www.typescriptlang.org/)
[![License](https://badgen.net/npm/license/env-var)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/evanshortiss/env-var/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/env-var?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/env-var.svg?style=flat)](https://www.npmjs.com/package/env-var)
[![Known Vulnerabilities](https://snyk.io//test/github/evanshortiss/env-var/badge.svg?targetFile=package.json)](https://snyk.io//test/github/evanshortiss/env-var?targetFile=package.json)


Verification, sanitization, and type coercion for environment variables in Node.js and web applications. Supports TypeScript!
<br>
<br>
</div>

* 🏋 Lightweight. Zero dependencies and just ~4.7kB when minified!
* 🧹 Clean and simple code, as [shown here](https://gist.github.com/evanshortiss/0cb049bf676b6138d13384671dad750d).
* 🚫 [Fails fast](https://en.wikipedia.org/wiki/Fail-fast) if your environment is misconfigured.
* 👩‍💻 Friendly error messages and example values for better debugging experience.
* 🎉 TypeScript support provides compile time safety and better developer experience.
* 📦 Support for frontend projects, e.g in React, React Native, Angular, etc.

## Contents

- [API](API.md): Complete API documentation.
- [Examples](EXAMPLE.md): Includes examples for use with React, Vite, etc.
- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)

## Install

### npm

```shell
npm install env-var --save
```

### yarn

```shell
yarn add env-var
```

## Getting started

You can use `env-var` in both JavaScript and TypeScript!

### JavaScript example

```js
const env = require('env-var');

// Import syntax is also supported
// import * as env from 'env-var'

const PASSWORD = env.get('DB_PASSWORD')
  // Throw an error if the DB_PASSWORD variable is not set (optional)
  .required()
  // Decode DB_PASSWORD from base64 to a utf8 string (optional)
  .convertFromBase64()
  // Call asString (or other APIs) to get the variable value (required)
  .asString();

// Read in a port (checks that PORT is in the range 0 to 65535)
// Alternatively, use a default value of 5432 if PORT is not defined
const PORT = env.get('PORT').default('5432').asPortNumber()
```

### TypeScript example

```ts
import { get } from 'env-var';

// Read the PORT environment variable. An EnvVarError will be thrown if the
// variable is not set, or if is not in the range 0 to 65535
const PORT: number = get('PORT').required().asPortNumber();
```

For more examples refer to [EXAMPLE.md](EXAMPLE.md) and the `/example`
directory.

## API

`env-var` supports many accessor functions such as `asFloatPositive()`, `asJson()` and `asRegExp()`. For a full list of `env-var` API calls, check out [API.md](API.md).

You can also create your own custom accessor; refer to the [`usingAccessor` section of API.md](API.md#usingAccessor).

## FAQ / Examples

* Integration with dotenv
* Logging
* React
* Next.js
* Vite
* Custom Accessors & Validation Logic

## Contributing

Contributions are welcomed and discussed in [CONTRIBUTING.md](CONTRIBUTING.md). If you would like to discuss an idea, open an issue or a PR with an initial implementation.

## Contributors

* @aautio
* @avocadomaster
* @caccialdo
* @ChibiBlasphem
* @DigiPie
* @evanshortiss
* @gabrieloczkowski
* @hhravn
* @ineentho
* @itavy
* @jerome-fox
* @joh-klein
* @Lioness100
* @MikeyBurkman
* @pepakriz
* @rmblstrp
* @shawnmclean
* @todofixthis
* @xuo
