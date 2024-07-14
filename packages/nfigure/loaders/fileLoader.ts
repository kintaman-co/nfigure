import { resolve } from "path";
import { CfgInternal, Mode } from "../cfgcfg";
import { readFileSync } from "fs";

export function fileLoader(
  path: string,
  configInternal: CfgInternal,
  mode: Mode,
  fileFromEnv: boolean,
): string {
  let normalizedPath = path;
  if (fileFromEnv) {
    normalizedPath = resolve(process.cwd(), path);
  }

  return readFileSync(normalizedPath, "utf-8");
}

export default fileLoader;
