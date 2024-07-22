/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest, it, expect } from "@jest/globals";

const statSync = jest.fn();
jest.mock("node:fs", () => {
  return {
    statSync,
  };
});

const processCwd = jest.spyOn(process, "cwd");

import { defaultFileSearcher } from "./defaultFileSearcher";
import { defaultCfgCfg } from "../cfgcfg";

type FileSystemMock = Record<string, string>; // fullpath => content
function mockDirectory(fs: FileSystemMock) {
  statSync.mockClear();
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

  expect(mockedFn.mock.calls[0][0]).toBe(
    "/another/path/to/config.appenv.nodenv.json",
  );
  expect(mockedFn.mock.calls[1][0]).toBe("/another/path/to/config.appenv.json");
  expect(mockedFn.mock.calls[2][0]).toBe("/another/path/to/config.nodenv.json");
  expect(mockedFn.mock.calls[3][0]).toBe("/another/path/to/config.json");
  expect(foundFiles).toEqual([
    "/another/path/to/config.appenv.json",
    "/another/path/to/config.json",
  ]);
});

it("should seek the expected files when the mode is base", () => {
  processCwd.mockReturnValue("/another/path/to");
  process.env.NODE_ENV = "nodenv";
  process.env.APP_ENV = "appenv";
  const mockedFn = mockDirectory({
    "/another/path/to/config.appenv.local.json": `{"foo": "baz"}`,
    "/another/path/to/config.nodenv.patch.json": `{"foo": "baz"}`,
    "/another/path/to/config.local.json": `{"foo": "quux"}`,
    "/another/path/to/config.json": `{"foo": "quux"}`,
  });

  const fileSearcher = defaultFileSearcher();

  const foundFiles = fileSearcher("patch", {
    ...defaultCfgCfg,
  });

  [
    "/another/path/to/config.appenv.nodenv.patch.json",
    "/another/path/to/config.appenv.nodenv.local.json",
    "/another/path/to/config.appenv.patch.json",
    "/another/path/to/config.appenv.local.json",
    "/another/path/to/config.nodenv.patch.json",
    "/another/path/to/config.nodenv.local.json",
    "/another/path/to/config.patch.json",
    "/another/path/to/config.local.json",
  ].forEach((expectedPath, index) => {
    expect(mockedFn.mock.calls[index][0]).toBe(expectedPath);
  });

  expect(foundFiles).toEqual([
    "/another/path/to/config.appenv.local.json",
    "/another/path/to/config.nodenv.patch.json",
    "/another/path/to/config.local.json",
  ]);
});

it("should change env keys", () => {
  processCwd.mockReturnValue("/path/to");
  process.env.CUSTOM_NODE_ENV = "bar";
  process.env.CUSTOM_APP_ENV = "foo";
  const mockedFn = mockDirectory({});

  const fileSearcher = defaultFileSearcher();

  fileSearcher("base", {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "CUSTOM_NODE_ENV",
      appEnv: "CUSTOM_APP_ENV",
    },
  });
  expect(mockedFn.mock.calls[0][0]).toBe("/path/to/config.foo.bar.json");
});

it("should change env keys and handles with default value", () => {
  processCwd.mockReturnValue("/path/to");
  const mockedFn = mockDirectory({});

  const fileSearcher = defaultFileSearcher();

  fileSearcher("patch", {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "NONEXIST_NODE_ENV",
      appEnv: "NONEXIST_APP_ENV",
    },
  });
  [
    "/path/to/config.development.development.patch.json",
    "/path/to/config.development.development.local.json",
    "/path/to/config.development.patch.json",
    "/path/to/config.development.local.json",
    "/path/to/config.development.patch.json",
    "/path/to/config.development.local.json",
    "/path/to/config.patch.json",
    "/path/to/config.local.json",
  ].forEach((expectedPath, index) => {
    expect(mockedFn.mock.calls[index][0]).toBe(expectedPath);
  });
});
