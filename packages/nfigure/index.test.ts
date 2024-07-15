/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, expect, it, jest } from "@jest/globals";
import { nfigure } from "./nfigure";
import type { Parser, Loader, FileSearcher } from "./cfgcfg";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";

// --- type test utility start
type AssertNonAny<T> = 0 extends 1 & T ? false : true;

type AssertStrictEqual<T, U> = T extends U
  ? U extends T
    ? true
    : false
  : false;

// use IsAny to check if the type is not the ANY type
function expectTrueType<T extends true>() {}
// --- type test utility end

// --- mocked plugins start
const fixtureLoader = jest.fn<Loader>();
const mockedJsonParser = jest.fn<Parser>((text) => JSON.parse(text.content));
const fixtureSearcher = jest.fn<FileSearcher>();

beforeEach(() => {
  jest.clearAllMocks();
});

// --- mocked plugins end

// --- test cases start
it("should load", () => {
  fixtureSearcher
    .mockReturnValueOnce(["/path/to/config.json"])
    .mockReturnValueOnce([]);
  fixtureLoader.mockReturnValueOnce({
    content: `{"foo": "bar"}`,
    loadedPath: "/path/to/config.json",
  });
  const config = nfigure({
    parser: mockedJsonParser,
    loader: fixtureLoader,
    fileSearcher: fixtureSearcher,
  });

  expectTrueType<AssertNonAny<typeof config>>();
  expectTrueType<AssertStrictEqual<typeof config, Record<string, unknown>>>();

  expect(config).toEqual({ foo: "bar" });
});

it("should load with patch", () => {
  fixtureSearcher
    .mockReturnValueOnce(["/path/to/config.json"])
    .mockReturnValueOnce(["/path/to/config.local.json"]);
  fixtureLoader
    .mockReturnValueOnce({
      content: `{"foo": "base", "bar": "base", "qux": "base"}`,
      loadedPath: "/path/to/config.json",
    })
    .mockReturnValueOnce({
      content: `{"foo": "patch", "baz": "patch", "qux": null}`,
      loadedPath: "/path/to/config.local.json",
    });
  const config = nfigure({
    parser: mockedJsonParser,
    loader: fixtureLoader,
    fileSearcher: fixtureSearcher,
  });

  expect(config).toEqual({ foo: "patch", bar: "base", baz: "patch" });
});

it("should load with validator", () => {
  fixtureSearcher
    .mockReturnValueOnce(["/path/to/config.json"])
    .mockReturnValueOnce([]);
  fixtureLoader.mockReturnValueOnce({
    content: `{"foo": "bar"}`,
    loadedPath: "/path/to/config.json",
  });
  const validator = typeboxValidator(Type.Object({ foo: Type.String() }));
  const config = nfigure({
    parser: mockedJsonParser,
    loader: fixtureLoader,
    fileSearcher: fixtureSearcher,
    validator,
  });

  expectTrueType<AssertNonAny<typeof config>>();
  expectTrueType<
    AssertStrictEqual<
      typeof config,
      {
        foo: string;
      }
    >
  >();

  expect(config).toEqual({ foo: "bar" });
});

it("should load with validator(fail)", () => {
  fixtureSearcher
    .mockReturnValueOnce(["/path/to/config.json"])
    .mockReturnValueOnce([]);
  fixtureLoader.mockReturnValueOnce({
    content: `{"foo": "bar"}`,
    loadedPath: "/path/to/config.json",
  });
  const validator = typeboxValidator(
    Type.Object({ foo: Type.Const("nonexist") }),
  );
  expect(() =>
    nfigure({
      parser: mockedJsonParser,
      loader: fixtureLoader,
      fileSearcher: fixtureSearcher,
      validator,
    }),
  ).toThrowError("config validation failed");
});

it("should fail if base config is not found", () => {
  fixtureSearcher.mockReturnValueOnce([]).mockReturnValueOnce([]);

  expect(() => {
    nfigure({
      parser: mockedJsonParser,
      loader: fixtureLoader,
      fileSearcher: fixtureSearcher,
    });
  }).toThrowError("base config is required");
});

it("should load from env (json text)", () => {
  process.env.CUSTOM_JSON_BASE = `{"foo": "env"}`;
  fixtureSearcher.mockReturnValueOnce([]).mockReturnValueOnce([]);
  const config = nfigure({
    parser: mockedJsonParser,
    loader: fixtureLoader,
    fileSearcher: fixtureSearcher,
    envKeys: {
      jsonBase: "CUSTOM_JSON_BASE",
    },
  });

  expect(config).toEqual({ foo: "env" });
});

it("should load from env (json file)", () => {
  process.env.CUSTOM_JSON_PATH = `/custom/path/to/config.json`;
  process.env.CUSTOM_JSON_PATH_PATCH = `/custom/path/to/config.local.json`;
  fixtureLoader
    .mockReturnValueOnce({
      content: `{"foo": "env"}`,
      loadedPath: "/custom/path/to/config.json",
    })
    .mockReturnValueOnce({
      content: `{"foo": "patch"}`,
      loadedPath: "/custom/path/to/config.local.json",
    });
  const config = nfigure({
    parser: mockedJsonParser,
    loader: fixtureLoader,
    fileSearcher: fixtureSearcher,
    envKeys: {
      fileBase: "CUSTOM_JSON_PATH",
      filePatch: "CUSTOM_JSON_PATH_PATCH",
    },
  });

  expect(config).toEqual({ foo: "patch" });
  expect(fixtureSearcher).not.toBeCalled();
});

it("should not load multiple files", () => {
  const fixtureSearcher = jest.fn<FileSearcher>();
  fixtureSearcher.mockReturnValueOnce([
    "/path/to/config.json",
    "/path/to/config.local",
  ]);
  expect(() => {
    nfigure({
      parser: mockedJsonParser,
      loader: fixtureLoader,
      fileSearcher: fixtureSearcher,
    });
  }).toThrowError("expected 1 file, but found 2");
});

// --- test cases end
