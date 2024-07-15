/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, expect } from "@jest/globals";

import { applyPatch } from "./applyPatch";

function createTestCase(
  base: Record<any, any>,
  patch: Record<any, any>,
  expected: Record<any, any>,
  name?: string,
) {
  it(name ?? "should apply patch", () => {
    const result = applyPatch(base, patch);
    expect(result).toEqual(expected);
  });
}

createTestCase({ foo: "bar" }, { foo: "baz" }, { foo: "baz" });
createTestCase({ foo: "bar" }, { bar: "baz" }, { foo: "bar", bar: "baz" });
createTestCase({ foo: "bar" }, { foo: null }, {});
createTestCase({ foo: "bar" }, { foo: undefined }, {});
createTestCase(
  { foo: "bar" },
  { foo: { bar: "baz" } },
  { foo: { bar: "baz" } },
);
createTestCase(
  { foo: { bar: "baz" } },
  { foo: { bar: "qux" } },
  { foo: { bar: "qux" } },
);
createTestCase({ foo: { bar: "baz" } }, { foo: { bar: null } }, { foo: {} });
createTestCase(
  { foo: { bar: "baz" } },
  { foo: { bar: undefined } },
  { foo: {} },
);
createTestCase(
  { foo: { bar: "baz" } },
  { foo: { baz: "qux" } },
  { foo: { bar: "baz", baz: "qux" } },
);
createTestCase(
  { foo: { bar: "baz" } },
  { foo: { bar: "qux", baz: "qux" } },
  { foo: { bar: "qux", baz: "qux" } },
);

// try prototype pollution attack with patch
createTestCase(
  {},
  { __proto__: { pollute: "polluted" } },
  {},
  "should not pollute with __proto__",
);
createTestCase(
  {},
  { constructor: { pollute: "polluted" } },
  {},
  "should not pollute with constructor",
);
createTestCase(
  {},
  { prototype: { pollute: "polluted" } },
  {},
  "should not pollute with prototype",
);
