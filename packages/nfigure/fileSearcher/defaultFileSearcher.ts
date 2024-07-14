import path from "path";
import { CfgInternal, Mode } from "../cfgcfg";
import { statSync } from "node:fs";
import { debug } from "../nfigure";

export function jsonParser(mode: Mode, configInternal: CfgInternal): string[] {
  const envKeys = configInternal.envKeys;
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

  const foundFiles = [];
  // 候補を順番に試していき、最初に見つかったものを返す
  for (const candidate of candidates) {
    const fullpath = path.resolve(searchBase, candidate);
    try {
      // ファイルが存在するか
      statSync(fullpath);
      foundFiles.push(fullpath);
    } catch (e) {
      // だいたいのケースは ENOENT。EACCESなどもありうるが、それは一旦考慮しない
      debug(`config file not found: ${fullpath}`);
    }
  }
  return foundFiles;
}

export default jsonParser;
