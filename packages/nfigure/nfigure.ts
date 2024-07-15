import { applyPatch } from "./applyPatch";
import { CfgCfg, CfgInternal, defaultCfgCfg, Mode } from "./cfgcfg";

export function nfigure<T extends Record<string, unknown>>(cfgcfg?: CfgCfg<T>) {
  const cfgInt = {
    ...defaultCfgCfg,
    // デフォルトコンフィグでは普通にファイルをロードしてしまうので、デフォルトコンフィグパターンは無視する
    // istanbul ignore next
    ...(cfgcfg ?? {}),
  } as CfgInternal;

  const merged = loadMergedObject(cfgInt);
  if (cfgcfg?.validator) {
    if (!cfgcfg.validator(merged, cfgInt)) {
      throw new Error("config validation failed");
    }
  }
  return merged as T;
}

function loadMergedObject(cfgInt: CfgInternal) {
  const base = loadObject("base", cfgInt);
  if (!base) {
    throw new Error("base config is required");
  }
  const patch = loadObject("patch", cfgInt);
  if (!patch) {
    return base;
  }
  return mergeObjects(base, patch);
}

function mergeObjects(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
) {
  return applyPatch(base, patch);
}

function loadObject(mode: Mode, cfgInt: CfgInternal) {
  const text = loadText(mode, cfgInt);
  if (!text) {
    return;
  }
  const parsed = cfgInt.parser(text, cfgInt);
  return parsed;
}

function loadText(mode: Mode, cfgInt: CfgInternal) {
  // first find JSON string in Environment variables
  const jsonEnvKey =
    mode === "base" ? cfgInt.envKeys.jsonBase : cfgInt.envKeys.jsonPatch;
  const jsonEnvValue = process.env[jsonEnvKey];
  if (jsonEnvValue) {
    debug(`loading ${mode} config from env...`);
    return {
      content: jsonEnvValue,
    };
  }

  // then find file path in Environment variables
  const fileEnvKey =
    mode === "base" ? cfgInt.envKeys.fileBase : cfgInt.envKeys.filePatch;
  const fileEnvValue = process.env[fileEnvKey];
  if (fileEnvValue) {
    debug(`loading ${mode} config from file: ${fileEnvValue}`);
    return cfgInt.loader(fileEnvValue, cfgInt, mode, true);
  }

  // then find file path in default location
  const filesFound = cfgInt.fileSearcher(mode, cfgInt);
  if (filesFound.length > 1) {
    throw new Error(`expected 1 file, but found ${filesFound.length}`);
  } else if (filesFound.length === 0) {
    debug(`no ${mode} config found`);
    return;
  }
  const file = filesFound[0];
  debug(`loading ${mode} config from file: ${file}`);
  return cfgInt.loader(file, cfgInt, mode, false);
}

// loggerはconfigに依存しており、そうなるとconfigのロードにloggerが必要になるため、pre-loggerな形でconsoleを使う。出荷時には無効化すること！
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function debug(msg: string) {
  //console.debug(msg);
}
