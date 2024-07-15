import { it, expect, jest, beforeEach } from "@jest/globals";
import { FileSearcher, Loader, nfigure, Parser } from "@kintaman-co/nfigure";
import { Type } from "@sinclair/typebox";

import typeboxValidator from "./index";

// --- type test utility start
type AssertNonAny<T> = 0 extends 1 & T ? false : true;

type AssertStrictEqual<T, U> = T extends U
  ? U extends T
    ? true
    : false
  : false;

// use IsAny to check if the type is not the ANY type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
