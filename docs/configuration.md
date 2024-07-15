# Configuration of nfigure

`nfigure` has a robust system that allows you to customize the configuration loading process.

You can configure `nfigure` by passing an configuration object to the `nfigure()` function.

## Installation

Create a file that calls and exposes `nfigure()`. For example, `config.js`:

```js
// config.js
import { nfigure } from "@kintaman-co/nfigure";

export default nfigure({
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

| Type           | Default      | Required |
| -------------- | ------------ | -------- |
| `Validator<T>` | `() => true` | No       |

The `validator` option allows you to validate the configuration. The validator function should return `true` if the configuration is valid, and `false` otherwise. The result is also used to type the configuration with the power of TypeScript.

The definition of `Validator<T>` is:

```ts
/**
 * ValidatorConfig is a function that validates the loaded configuration.
 * If the configuration is valid, it should return `true`, otherwise `false`.
 * @param value The value to validate
 * @param configInternal The configuration passed to `load` function
 * @returns `true` if the value is valid, otherwise `false`
 */
export type Validator<T> = (
  value: unknown,
  configInternal: CfgInternal,
) => value is T;
```

Here is an example of a configuration for typebox typing and validation:

```js
// config.js
import { nfigure } from "@kintaman-co/nfigure";
import { validator as typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";

const schema = Type.Object({
  PORT: Type.String(),
  DATABASE_URL: Type.String(),
});

const config = nfigure({
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
export type EnvKeys = {
  jsonBase: string;
  jsonPatch: string;
  fileBase: string;
  filePatch: string;
  appEnv: string;
  nodeEnv: string;
};
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

### `loader`

| Type     | Default           | Required |
| -------- | ----------------- | -------- |
| `Loader` | `defaultLoader()` | No       |

The `loader` option allows you to customize the configuration loading process.

`Loader` is a function that loads the configuration.
It should take the path to the configuration file, the configuration passed to the `load` function, the mode of the configuration loading, and a boolean that indicates if the configuration file is loaded from an environment variable.
The path must be absolute path when the path is from `FileSearcher`.
It should return the loaded configuration and the resolved full absolute path of the loaded configuration.

`defaultLoader()` is a default loader that loads the configuration from the file system.

The definition of `Loader` is:

```ts
export type Loader = (
  path: string,
  configInternal: CfgInternal,
  mode: Mode,
  fileFromEnv: boolean,
) => {
  content: string;
  loadedPath: string;
};
```

### `Parser`

| Type     | Default        | Required |
| -------- | -------------- | -------- |
| `Parser` | `jsonParser()` | No       |

The `Parser` option allows you to customize the configuration parsing process.

`Parser` is a function that parses the configuration content.
It should take the content of the configuration file and the configuration passed to the `load` function.
It can also take the path that the content is loaded from. You can use this path to determine the parser behavior, such as the file extension.
It should return the parsed configuration.

`jsonParser()` is a default parser that parses the configuration as JSON.

The definition of `Parser` is:

```ts
export type Parser = (
  text: {
    content: string;
    loadedPath?: string;
  },
  configInternal: CfgInternal,
) => Record<string, unknown>;
```

### `FileSearcher`

| Type           | Default                 | Required |
| -------------- | ----------------------- | -------- |
| `FileSearcher` | `defaultFileSearcher()` | No       |

The `FileSearcher` option allows you to customize the configuration file search process.

`FileSearcher` is a function that searches for the configuration file.
It should take the configuration passed to the `load` function and the mode of the configuration loading.
It should return the found absolute path list to the configuration file.

`FileSearcher` can return multiple paths, but multiple paths are not supported in the default loader.

`defaultFileSearcher()` is a default file searcher that searches for the configuration file in the current directory and the parent directories.

The definition of `FileSearcher` is:

```ts
export type FileSearcher = (
  mode: Mode,
  configInternal: CfgInternal,
) => string[];
```
