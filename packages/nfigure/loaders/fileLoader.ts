import { resolve } from "path";
import { Mode, readFileSync } from "fs";
import { CfgInternal } from "../cfgcfg";

export function fileLoader() {
  return (
    path: string,
    configInternal: CfgInternal,
    mode: Mode,
    fileFromEnv: boolean,
  ): string => {
    let normalizedPath = path;
    if (fileFromEnv) {
      normalizedPath = resolve(process.cwd(), path);
    }

    return readFileSync(normalizedPath, "utf-8");
  };
}

export default fileLoader;
