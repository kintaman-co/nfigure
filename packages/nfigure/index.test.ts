/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from "@jest/globals";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";
import { CfgInternal, defaultCfgCfg, Mode } from "./cfgcfg";
import { nfigure } from "./nfigure";
import { addType } from "./validators/addType";

test("nfigure", () => {
  const loadedConfig = nfigure({
    validator: typeboxValidator(Type.Object({ foo: Type.Const("patch") })),
    parser: jsonParser(),
    loader: fixtureLoader(),
    fileSearcher: fixtureSearcher(),
    envKeys: defaultCfgCfg.envKeys,
  });
  expectTrueType<AssertNonAny<typeof loadedConfig>>();
  expectTrueType<AssertStrictEqual<typeof loadedConfig, { foo: string }>>();
  expect(loadedConfig).toEqual({ foo: "patch", baz: "patch" });
});

test("nfigure wo validator", () => {
  const loadedConfig = nfigure({
    parser: jsonParser(),
    loader: fixtureLoader(),
    fileSearcher: fixtureSearcher(),
    envKeys: defaultCfgCfg.envKeys,
  });
  expectTrueType<AssertNonAny<typeof loadedConfig>>();
  expectTrueType<
    AssertStrictEqual<typeof loadedConfig, Record<string, unknown>>
  >();
  expect(loadedConfig).toEqual({ foo: "patch", baz: "patch" });
});

test("nfigure with type", () => {
  const loadedConfig = nfigure({
    validator: addType<{ key: string }>(),
    parser: jsonParser(),
    loader: fixtureLoader(),
    fileSearcher: fixtureSearcher(),
    envKeys: defaultCfgCfg.envKeys,
  });
  expectTrueType<AssertNonAny<typeof loadedConfig>>();
  expectTrueType<AssertStrictEqual<typeof loadedConfig, { key: string }>>();
  expect(loadedConfig).toEqual({ foo: "patch", baz: "patch" });
});

test("nfigure with type2", () => {
  const loadedConfig = nfigure({
    validator: addType<{ key: "patch" }>(
      typeboxValidator(Type.Object({ foo: Type.String() })),
    ),
    parser: jsonParser(),
    loader: fixtureLoader(),
    fileSearcher: fixtureSearcher(),
    envKeys: defaultCfgCfg.envKeys,
  });
  expectTrueType<AssertNonAny<typeof loadedConfig>>();
  expectTrueType<AssertStrictEqual<typeof loadedConfig, { key: "patch" }>>();
  expect(loadedConfig).toEqual({ foo: "patch", baz: "patch" });
});

test("nfigure fail", () => {
  expect(() => {
    const loadedConfig = nfigure({
      validator: typeboxValidator(Type.Object({ foo: Type.Const("pqtch") })),
      parser: jsonParser(),
      loader: fixtureLoader(),
      fileSearcher: fixtureSearcher(),
      envKeys: defaultCfgCfg.envKeys,
    });
  }).toThrowError("config validation failed");
});

function fixtureSearcher() {
  return function (mode: "base" | "patch", _cfgInternal: CfgInternal) {
    if (mode === "base") {
      return ["/path/to/base.json"];
    } else {
      return ["/path/to/patch.json"];
    }
  };
}

function fixtureLoader() {
  return (
    path: string,
    _cfgInternal: CfgInternal,
    _mode: Mode,
    _fileFromEnv: boolean,
  ) => {
    if (path === "/path/to/base.json") {
      return JSON.stringify({ foo: "base", bar: "base" });
    }
    if (path === "/path/to/patch.json") {
      return JSON.stringify({ foo: "patch", bar: null, baz: "patch" });
    }
    throw new Error("unexpected path");
  };
}

function jsonParser() {
  return (text: string, _cfgInternal: CfgInternal) => JSON.parse(text);
}

type AssertNonAny<T> = 0 extends 1 & T ? false : true;

type AssertStrictEqual<T, U> = T extends U
  ? U extends T
    ? true
    : false
  : false;

// use IsAny to check if the type is not the ANY type
function expectTrueType<T extends true>() {}
