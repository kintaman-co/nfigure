import config, { load } from "@kintaman-co/nfigure";
import typeboxValidator from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";
import assert from "node:assert/strict";

assert.ok(config, "config should be loaded");
assert.deepStrictEqual(
  config,
  {
    base: "The base value",
    overriden: "The patched value",
    new: "The patched value",
  },
  "config should be loaded and merged correctly",
);

const customConfig = load({});

assert.ok(customConfig, "customConfig should be loaded");
assert.deepStrictEqual(
  customConfig,
  {
    base: "The base value",
    overriden: "The patched value",
    new: "The patched value",
  },
  "customConfig should be loaded and merged correctly",
);

const customConfigWithValidator = load({
  validator: typeboxValidator(
    Type.Object({
      base: Type.String(),
      overriden: Type.String(),
      new: Type.Optional(Type.String()),
      beingRemoved: Type.Optional(Type.String()),
    }),
  ),
});

assert.ok(
  customConfigWithValidator,
  "customConfigWithValidator should be loaded",
);
assert.deepStrictEqual(
  customConfigWithValidator,
  {
    base: "The base value",
    overriden: "The patched value",
    new: "The patched value",
  },
  "customConfigWithValidator should be loaded and merged correctly",
);

const failureConfig = load({
  validator: typeboxValidator(
    Type.Object({
      base: Type.Const("Never gonna give you up"),
      overriden: Type.Const("Never gonna let you down"),
      new: Type.Const("Never gonna run around and desert you"),
      beingRemoved: Type.Null(),
    }),
  ),
});

// This should throw an error and crash the process
assert.ok(!failureConfig, "failureConfig should not be loaded");
