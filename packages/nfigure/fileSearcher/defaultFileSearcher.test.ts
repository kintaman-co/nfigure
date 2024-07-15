/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest, it, expect } from "@jest/globals";

const statSync = jest.fn();
jest.mock("fs", () => {
  return {
    statSync,
  };
});

const processCwd = jest.spyOn(process, "cwd");

import { defaultFileSearcher } from "./defaultFileSearcher";
import { defaultCfgCfg } from "../cfgcfg";

type FileSystemMock = Record<string, string>; // fullpath => content
function mockDirectory(fs: FileSystemMock) {
  return statSync.mockImplementation((path: unknown, opt: any = {}) => {
    expect(typeof path).toBe("string");
    const checkedPath = path as string;

    const { throwIfNoEntry = true } = opt;
    if (fs[checkedPath]) {
      return {};
    }
    if (throwIfNoEntry) {
      throw new Error("ENOENT");
    }
  });
}

it("should return found files", () => {
  processCwd.mockReturnValue("/path/to");
  mockDirectory({
    "/path/to/config.json": `{"foo": "bar"}`,
    "/path/to/config.local.json": `{"foo": "baz"}`,
  });

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("base", {
    ...defaultCfgCfg,
  });
  expect(foundFiles).toEqual(["/path/to/config.json"]);

  const foundFiles2 = fileSearcher("patch", {
    ...defaultCfgCfg,
  });
  expect(foundFiles2).toEqual(["/path/to/config.local.json"]);
});

it("should return an empty array if no files are found", () => {
  processCwd.mockReturnValue("/path/to");
  mockDirectory({});

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("base", {
    ...defaultCfgCfg,
  });
  expect(foundFiles).toEqual([]);
});

it("should handle multiple file types", () => {
  processCwd.mockReturnValue("/path/to");
  mockDirectory({
    "/path/to/config.json": `{"foo": "bar"}`,
    "/path/to/config.yaml": `foo: bar`,
    "/path/to/config.xml": `<foo>bar</foo>`,
  });

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("base", {
    ...defaultCfgCfg,
  });
  expect(foundFiles).toEqual(["/path/to/config.json"]);
});

it("should handle nested directories", () => {
  processCwd.mockReturnValue("/path/to");
  mockDirectory({
    "/path/to/config.json": `{"foo": "bar"}`,
    "/path/to/nested/config.json": `{"foo": "baz"}`,
  });

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("base", {
    ...defaultCfgCfg,
  });
  expect(foundFiles).toEqual(["/path/to/config.json"]);
});

it("should seek the expected files when the mode is base", () => {
  processCwd.mockReturnValue("/another/path/to");
  process.env.NODE_ENV = "nodenv";
  process.env.APP_ENV = "appenv";
  const mockedFn = mockDirectory({
    "/another/path/to/config.appenv.json": `{"foo": "baz"}`,
    "/another/path/to/config.json": `{"foo": "quux"}`,
  });

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("base", {
    ...defaultCfgCfg,
  });

  expect(mockedFn).toHaveBeenCalledTimes(4);
  expect(foundFiles).toEqual([
    "/another/path/to/config.appenv.json",
    "/another/path/to/config.json",
  ]);
});
