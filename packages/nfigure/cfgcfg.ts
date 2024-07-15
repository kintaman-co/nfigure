import defaultFileSearcher from "./fileSearcher/defaultFileSearcher";
import fileLoader from "./loaders/fileLoader";
import jsonParser from "./parsers/jsonParser";
import defaultValidator from "./validators/default";

/**
 * Environment variable keys
 */
export type EnvKeys = {
  jsonBase: string;
  jsonPatch: string;
  fileBase: string;
  filePatch: string;
  appEnv: string;
  nodeEnv: string;
};

/**
 * Configuration for loading the configuration
 */
export type CfgCfg<T extends object> = {
  validator?: Validator<T>;
  envKeys?: Partial<EnvKeys>;
  parser?: Parser;
  loader?: Loader;
  fileSearcher?: FileSearcher;
};

/**
 * Internal configuration that will be passed to the internal functions
 * This should not be exposed to the end user
 * @internal
 */
export type CfgInternal = {
  validator: Validator<Record<string, unknown>>;
  envKeys: EnvKeys;
  parser: Parser;
  loader: Loader;
  fileSearcher: FileSearcher;
};

/**
 * Validator is a function that validates the loaded configuration.
 * If the configuration is valid, it should return `true`, otherwise `false`.
 * @param value The value to validate
 * @param configInternal The configuration passed to `load` function
 * @returns `true` if the value is valid, otherwise `false`, and the result is used for type narrowing of the value
 */
export type Validator<T> = (
  value: unknown,
  configInternal: CfgInternal,
) => value is T;

export type Parser = (
  text: {
    content: string;
    loadedPath?: string;
  },
  configInternal: CfgInternal,
) => Record<string, unknown>;
export type Loader = (
  path: string,
  configInternal: CfgInternal,
  mode: Mode,
  fileFromEnv: boolean,
) => {
  content: string;
  loadedPath?: string;
};
export type FileSearcher = (
  mode: Mode,
  configInternal: CfgInternal,
) => string[];

export type Mode = "base" | "patch";

/**
 * Default configs
 * @internal
 */
export const defaultCfgCfg = {
  envKeys: {
    jsonBase: "NFIGURE_JSON",
    jsonPatch: "NFIGURE_PATCH_JSON",
    fileBase: "NFIGURE_FILE",
    filePatch: "NFIGURE_PATCH_FILE",
    appEnv: "APP_ENV",
    nodeEnv: "NODE_ENV",
  },
  validator: defaultValidator,
  loader: fileLoader(),
  parser: jsonParser(),
  fileSearcher: defaultFileSearcher(),
} satisfies CfgInternal;
