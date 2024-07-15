/* eslint-disable @typescript-eslint/no-unused-vars */
import { it } from "@jest/globals";
import addType from "./addType";
import { expect } from "@jest/globals";
import { defaultCfgCfg } from "../cfgcfg";

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

it("should work", () => {
  const value: unknown = {};
  const validator = addType<{ foo: string }>();

  const result = validator(value, defaultCfgCfg);
  expect(result).toBe(true);
  if (result) {
    expectTrueType<AssertStrictEqual<typeof value, { foo: string }>>();
  } else {
    expectTrueType<AssertNonAny<never>>();
  }
});

it("should work with custom validator", () => {
  const validator = addType<{ foo: string }>;
  const validator2 = addType<{ bar: string }>;

  const result = validator(validator2());

  expect(result).toBe(false);
});
