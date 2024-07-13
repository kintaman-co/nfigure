# nfigure

`nfigure` is a configuration management tool brought to you by [Kintaman](https://kintaman.co) team at [AokiApp](https://aoki.app).

## Features

- Simple and intuitive syntax
- Supports multiple configuration formats (JSON, YAML, TOML, etc.)
- Supports patching and merging configurations
- Can be loaded from files, environment variables, or other sources
- Easy-to-setup helper scripts
- Plugins feature for extending functionality
- Type-safe configuration values\*
- Validation\*
- Version/Environment assertion\*
- Encryption\*
- And more...

\*: With optional plugins

## Installation

### Express installation with helper script

To install `nfigure`, simply run the following command in the project directory you want to use it in:

```bash
npx @kintaman-co/nfigure init
```

### Manual installation

To install `nfigure` manually, run the following command:

```bash
npm install @kintaman-co/nfigure
```

Optionally you can install the plugins you need:

```bash
npm install @kintaman-co/nfigure-typebox @sinclair/typebox
```

## Configuration Loading Rules

## Usage

### Basic usage

Set up your configuration file as `config.json`:

```json
{
  "message": "Hello, world!"
}
```

And then use it in your application:

```js
import config from "@kintaman-co/nfigure";

console.log(config.message);
```

### Advanced usage

If you want to customize the configuration, you can create a configuration file.

Here is an example of a configuration for typebox typing and validation:

```js
// config.js
import { load } from "@kintaman-co/nfigure";
import { validator as typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";

const schema = Type.Object({
  PORT: Type.String(),
  DATABASE_URL: Type.String(),
});

export default load({
  validator: typeboxValidator(schema), // give types and validates the configuration
});
```

And then use it in your application:

```js
import config from "./config";

console.log(config.PORT); // PORT will be typed and validated
```

For more configuration options, see the [configuration documentation](./docs/configuration.md).
