# Configuration Loading Rules

## How the configuration file is loaded

`nfigure` loads configuration from the following sources in order:

1. JSON string in Environment variables
2. File path in Environment variables
3. Configuration files

### JSON string in Environment variables

You can pass a JSON string directly to the environment variable. If it exists, the string will be loaded as the configuration.

By default, the environment variable is

- `NFIGURE_JSON` for base configuration in JSON string
- `NFIGURE_PATCH_JSON` for patch configuration in JSON string

### File path in Environment variables

You can pass a specified file path to the environment variable. If it exists, the file content will be parsed and loaded as the configuration.

By default, the environment variable is

- `NFIGURE_FILE` for base configuration file path
- `NFIGURE_PATCH_FILE` for patch configuration file path

The file path can be either **absolute** or relative to the **current working directory**.

### Configuration files

If neither the JSON string nor the file path is provided, `nfigure` will look for the configuration files in the following order:

#### Base Configuration

- `config.${APP_ENV}.${NODE_ENV}.json`
- `config.${APP_ENV}.json`
- `config.${NODE_ENV}.json`
- `config.json`

#### Patch Configuration

- `config.${APP_ENV}.${NODE_ENV}.patch.json`
- `config.${APP_ENV}.${NODE_ENV}.local.json`
- `config.${APP_ENV}.patch.json`
- `config.${APP_ENV}.local.json`
- `config.${NODE_ENV}.patch.json`
- `config.${NODE_ENV}.local.json`
- `config.patch.json`
- `config.local.json`

The files are loaded relative to the **current working directory**.

The `APP_ENV` and `NODE_ENV` environment variables are used to determine the appropriate configuration file. If these variables are not set, they default to `development`.
