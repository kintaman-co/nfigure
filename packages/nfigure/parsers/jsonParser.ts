import type { Parser } from "../cfgcfg";

export function jsonParser(): Parser {
  return ({ content }): Record<string, unknown> => {
    return JSON.parse(content);
  };
}

export default jsonParser;
