import { resolve } from "path";
import { Mode, readFileSync } from "fs";
import { CfgInternal } from "../cfgcfg";

export function fileLoader() {
  return (
    path: string,
    configInternal: CfgInternal,
    mode: Mode,
    fileFromEnv: boolean,
  ): {
    content: string;
    loadedPath: string;
  } => {
    let normalizedPath = path;
    if (fileFromEnv) {
      normalizedPath = resolve(process.cwd(), path);
    }

    const content = readFileSync(normalizedPath, "utf-8");
    return {
      content,
      loadedPath: normalizedPath,
    };
  };
}

export default fileLoader;
