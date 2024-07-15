import { nfigure, config } from "@kintaman-co/nfigure";
import { typeboxValidator } from "@kintaman-co/nfigure-typebox";
import { Type } from "@sinclair/typebox";
import assert from "node:assert";
import { info } from "node:console";

assert.ok(config, "config should be loaded");

assert.strictEqual(config.base, "The base value", "base should be loaded");
assert.strictEqual(
  config.overriden,
  "The patched value",
  "overriden should be loaded",
);
assert.strictEqual(config.new, "The patched value", "new should be loaded");

assert.deepStrictEqual(
  config.toJSON(),
  {
    base: "The base value",
    overriden: "The patched value",
    new: "The patched value",
  },
  "config should work with toJSON",
);

const customConfig = nfigure();

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

const customConfigWithValidator = nfigure({
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
try {
  nfigure({
    validator: typeboxValidator(
      Type.Object({
        base: Type.Const("Never gonna give you up"),
        overriden: Type.Const("Never gonna let you down"),
        new: Type.Const("Never gonna run around and desert you"),
        beingRemoved: Type.Null(),
      }),
    ),
  });
} catch (_) {
  assert.ok(true, "config validation failed");
}

info("All tests passed");
