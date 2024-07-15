/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, expect } from "@jest/globals";
import { jsonParser } from "./jsonParser";
import { defaultCfgCfg } from "../cfgcfg";

it("should parse json", () => {
  const parser = jsonParser();
  const result = parser({ content: `{"foo": "bar"}` }, defaultCfgCfg);
  expect(result).toEqual({ foo: "bar" });
});
