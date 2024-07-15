import { nfigure } from "./nfigure";

let _config: Record<string, unknown> | null = null;
export const config = new Proxy({} as Record<string, unknown>, {
  get: (target, prop) => {
    if (!_config) {
      _config = nfigure();
    }
    if (prop === "toJSON") {
      return () => _config;
    }

    return _config[prop as string];
  },
});
export default config;

import {
  Loader,
  CfgCfg,
  Mode,
  Parser,
  FileSearcher,
  Validator,
  EnvKeys,
} from "./cfgcfg";

export * as parsers from "./parsers";
export * as validators from "./validators";
export * as loaders from "./loaders";
export * as fileSearchers from "./fileSearchers";

export type { Loader, CfgCfg, Mode, Parser, FileSearcher, Validator, EnvKeys };
export { nfigure };
