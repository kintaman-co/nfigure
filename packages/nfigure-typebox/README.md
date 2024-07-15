# @kintaman-co/nfigure-typebox

This package provides a plugin for `@kintaman-co/nfigure` to use `@sinclair/typebox` for configuration typing and validation.

## Installation

```bash
npm install @kintaman-co/nfigure-typebox @sinclair/typebox
```

## Usage

### Basic usage

```js
// config.js
import { nfigure } from "@kintaman-co/nfigure";
import { validator as typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";

const schema = Type.Object({
  PORT: Type.String(),
  DATABASE_URL: Type.String(),
});

export default nfigure({
  validator: typeboxValidator(schema), // give types and validates the configuration
});
```

And then use it in your application:

```js
import config from "./config";

console.log(config.PORT);
```
