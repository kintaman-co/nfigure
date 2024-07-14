# Configuration of nfigure

`nfigure` has a robust system that allows you to customize the configuration loading process.

You can configure `nfigure` by passing an configuration object to the `load()` function.

## Installation

Create a file that calls and exposes `load()`. For example, `config.js`:

```js
// config.js
import { load } from "@kintaman-co/nfigure";

export default load({
  // configuration options
});
```

And use it in your application:

```js
import config from "./config";

console.log(config.message);
```

## Configuration Options

### `validator`

| Type                 | Default      | Required |
| -------------------- | ------------ | -------- |
| `ValidatorConfig<T>` | `() => true` | No       |

The `validator` option allows you to validate the configuration. The validator function should return `true` if the configuration is valid, and `false` otherwise.

The definition of `ValidatorConfig<T>` is:

```ts
/**
 * ValidatorConfig is a function that validates the loaded configuration.
 * If the configuration is valid, it should return `true`, otherwise `false`.
 * @param value The value to validate
 * @param configInternal The configuration passed to `load` function
 * @returns `true` if the value is valid, otherwise `false`
 */
export type ValidatorConfig<T> = (
  value: unknown,
  configInternal: ConfigInternal,
) => value is T;
```

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

const config = load({
  validator: typeboxValidator(schema),
});

expectType<typeof config,
  {
    PORT: string;
    DATABASE_URL: string;
  }
>();

export default config;
```

### `envKeys`

| Type      | Default       | Required |
| --------- | ------------- | -------- |
| `EnvKeys` | `defaultKeys` | No       |

The `envKeys` option allows you to customize the environment variable keys used to load the configuration.

The definition of `EnvKeys` is:

```ts
{
  jsonBase: string;
  jsonPatch: string;
  fileBase: string;
  filePatch: string;
  appEnv: string;
  nodeEnv: string;
}
```

The default keys are:

- `jsonBase`: `NFIGURE_JSON`
- `jsonPatch`: `NFIGURE_PATCH_JSON`
- `fileBase`: `NFIGURE_FILE`
- `filePatch`: `NFIGURE_PATCH_FILE`
- `appEnv`: `APP_ENV`
- `nodeEnv`: `NODE_ENV`

See [./loadrule.md](./loadrule.md) for more information on how the variables are used.

Here is an example of a configuration that uses custom environment variable keys:

```js
// config.js
import { load } from "@kintaman-co/nfigure";

const config = load({
  envKeys: {
    jsonBase: "MY_APP_JSON",
    jsonPatch: "MY_APP_PATCH_JSON",
    fileBase: "MY_APP_FILE",
    filePatch: "MY_APP_PATCH_FILE",
    appEnv: "MY_APP_ENV",
    nodeEnv: "MY_NODE_ENV",
  },
});

export default config;
```
