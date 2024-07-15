/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest, it, expect } from "@jest/globals";
const readFileSync = jest.fn();
jest.mock("node:fs", () => {
  return {
    readFileSync,
  };
});

import { fileLoader } from "./fileLoader";
import { CfgInternal, defaultCfgCfg } from "../cfgcfg";
it("can load file", () => {
  readFileSync.mockReturnValueOnce(`{"foo": "bar"}`);
  const cfgInt: CfgInternal = defaultCfgCfg;
  const loader = fileLoader();
  const result = loader("/path/to/config.json", cfgInt, "base", false);

  expect(result).toEqual({
    content: `{"foo": "bar"}`,
    loadedPath: "/path/to/config.json",
  });
});

it("can resolve relative path", () => {
  readFileSync.mockReturnValueOnce(`{"foo": "bar"}`);
  const cfgInt: CfgInternal = defaultCfgCfg;
  const loader = fileLoader();
  jest.spyOn(process, "cwd").mockReturnValueOnce("/path/to");
  const result = loader("config.json", cfgInt, "base", true);

  expect(result).toEqual({
    content: `{"foo": "bar"}`,
    loadedPath: "/path/to/config.json",
  });
});
