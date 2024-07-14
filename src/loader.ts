/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyPatch } from "./applyPatch";
import { readFileSync, statSync } from "fs";
import path from "path";
import { exit } from "process";

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

type EnvKeys = {
  jsonBase: string;
  jsonPatch: string;
  fileBase: string;
  filePatch: string;
  appEnv: string;
  nodeEnv: string;
};
type ConfigConfig<T extends object> = {
  validator?: ValidatorConfig<T>;
  envKeys?: Partial<EnvKeys>;
};

export type ConfigInternal = {
  validator: ValidatorConfig<Record<string, any>>;
  envKeys: EnvKeys;
};

const defaultValidator: ValidatorConfig<Record<string, any>> = (
  value,
): value is Record<string, any> => true;

export function load<T extends Record<string, any>>(
  configConfig: ConfigConfig<T>,
) {
  const validator = configConfig.validator || defaultValidator;

  const envKeys = {
    jsonBase: "NFIGURE_JSON",
    jsonPatch: "NFIGURE_PATCH_JSON",
    fileBase: "NFIGURE_FILE",
    filePatch: "NFIGURE_PATCH_FILE",
    appEnv: "APP_ENV",
    nodeEnv: "NODE_ENV",

    ...(configConfig.envKeys || {}),
  };
  const configInternal: ConfigInternal = {
    validator,
    envKeys,
  };

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  type ReturnType = (typeof configConfig)["validator"] extends void
    ? Record<string, any>
    : T;
  return loadConfig(validator, configInternal) as ReturnType;
}

/**
 * 設定をロードします
 */
export function loadConfig<T>(
  validator: ValidatorConfig<T>,
  configInternal: ConfigInternal,
) {
  const envKeys = configInternal.envKeys;

  let baseConfigText = "";
  let patchConfigText = "";
  try {
    // 設定ファイルをテキストで読み込む
    baseConfigText = loadConfigText(
      envKeys.jsonBase,
      envKeys.fileBase,
      "base",
      envKeys,
    );

    patchConfigText = loadConfigText(
      envKeys.jsonPatch,
      envKeys.filePatch,
      "patch",
      envKeys,
    );
  } catch (e) {
    error("failed to load config", e);
    throw e;
  }

  let baseConfig;
  let patchConfig;
  try {
    // JSONパース
    baseConfig = JSON.parse(baseConfigText);
    patchConfig = JSON.parse(patchConfigText);
  } catch (e) {
    error("failed to parse config", e);
    throw e;
  }

  // マージ
  const patchedConfig = applyPatch(baseConfig, patchConfig);

  // バリデーション
  if (!validator(patchedConfig, configInternal)) {
    error("config validation failed", patchedConfig);
    throw new Error("config validation failed");
  }
  return patchedConfig;
}

/**
 * 設定ファイルを読み込みます
 */
function loadConfigText(
  envKey: string,
  pathKey: string,
  mode: "base" | "patch",
  envKeys: EnvKeys,
) {
  let configText = "";

  const searchBase = process.cwd();

  const envText = process.env[envKey];
  const envPath = process.env[pathKey];

  if (envText) {
    // 設定が環境変数にある場合

    debug(`loading ${mode} config from env...`);
    configText = envText;
  } else if (envPath) {
    // 設定ファイルのパスが環境変数で指定されている場合

    const fullpath = path.resolve(searchBase, envPath);
    debug(`loading ${mode} config from file: ${fullpath}`);
    configText = readFileSync(fullpath, "utf-8");
  } else {
    // デフォルトの検索ルールで設定ファイルを探す
    const fullpath = searchConfigPath(mode, envKeys);
    if (fullpath) {
      // 設定ファイルが見つかった場合

      debug(`loading ${mode} config from file: ${fullpath}`);
      configText = readFileSync(fullpath, "utf-8");
    } else {
      // 設定ファイルが見つからなかった場合, 空の設定を使う

      debug(`no ${mode} config found, setting empty...`);
      configText = "{}";
    }
  }
  return configText;
}

/**
 * 設定ファイルを通常のルールで検索します
 */
function searchConfigPath(mode: "base" | "patch" = "base", envKeys: EnvKeys) {
  const NODE_ENV = process.env[envKeys.nodeEnv] || "development";
  const APP_ENV = process.env[envKeys.appEnv] || "development";

  // ファイル名候補
  // 上から順に優先度が高い
  const candidates =
    mode === "base"
      ? [
          `config.${APP_ENV}.${NODE_ENV}.json`,
          `config.${APP_ENV}.json`,
          `config.${NODE_ENV}.json`,
          `config.json`,
        ]
      : [
          `config.${APP_ENV}.${NODE_ENV}.patch.json`,
          `config.${APP_ENV}.${NODE_ENV}.local.json`,
          `config.${APP_ENV}.patch.json`,
          `config.${APP_ENV}.local.json`,
          `config.${NODE_ENV}.patch.json`,
          `config.${NODE_ENV}.local.json`,
          `config.patch.json`,
          `config.local.json`,
        ];

  // 検索ベースパスはプロセスのカレントディレクトリ
  const searchBase = process.cwd();

  // 候補を順番に試していき、最初に見つかったものを返す
  for (const candidate of candidates) {
    const fullpath = path.resolve(searchBase, candidate);
    try {
      // ファイルが存在するか
      statSync(fullpath);
      return fullpath;
    } catch (e) {
      // だいたいのケースは ENOENT。EACCESなどもありうるが、それは一旦考慮しない
      debug(`config file not found: ${fullpath}`);
    }
  }
}

// loggerはconfigに依存しており、そうなるとconfigのロードにloggerが必要になるため、pre-loggerな形でconsoleを使う。出荷時には無効化すること！
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function debug(msg: string) {
  //console.debug(msg);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function error(msg: string, e: unknown) {
  console.error(msg, e);
  exit(1);
}
