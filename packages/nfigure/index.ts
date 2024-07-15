import { nfigure } from "./nfigure";

let _config: Record<string, unknown> | null = null;
export const config = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (!_config) {
        _config = nfigure();
      }
      return _config[prop as string];
    },
  },
);
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
