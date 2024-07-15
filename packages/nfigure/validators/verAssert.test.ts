/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, expect } from "@jest/globals";
import { verAssert } from "./verAssert";
import defaultValidator from "./default";
import { defaultCfgCfg } from "../cfgcfg";

it("should assert version correctly", () => {
  const ass = verAssert(1, defaultValidator);
  const cfgInt = {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "CUSTOM_NODE_ENV",
      appEnv: "CUSTOM_APP_ENV",
    },
  };

  process.env.CUSTOM_NODE_ENV = "foobar";
  process.env.CUSTOM_APP_ENV = "foobaz";
  const result = ass(
    {
      version: 1,
      expectedNodeEnv: "foobar",
      expectedAppEnv: "foobaz",
    },
    cfgInt,
  );

  expect(result).toBe(true);
});

it("should assert invalid version", () => {
  const ass = verAssert(2, defaultValidator);
  const cfgInt = {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "CUSTOM_NODE_ENV",
      appEnv: "CUSTOM_APP_ENV",
    },
  };

  process.env.CUSTOM_NODE_ENV = "foobar";
  process.env.CUSTOM_APP_ENV = "foobaz";

  expect(() =>
    ass(
      {
        version: 1,
        expectedNodeEnv: "foobar",
        expectedAppEnv: "foobaz",
      },
      cfgInt,
    ),
  ).toThrowError("Invalid version: expected 2, got 1");
});

it("should assert invalid APP_ENV value", () => {
  const ass = verAssert(2, defaultValidator);
  const cfgInt = {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "CUSTOM_NODE_ENV",
      appEnv: "CUSTOM_APP_ENV",
    },
  };

  process.env.CUSTOM_NODE_ENV = "nodenv";
  process.env.CUSTOM_APP_ENV = "invalid";

  expect(() =>
    ass(
      {
        version: 2,
        expectedNodeEnv: "nodenv",
        expectedAppEnv: "appenv",
      },
      cfgInt,
    ),
  ).toThrowError("Invalid APP_ENV: expected appenv, got invalid");
});

it("should assert invalid NODE_ENV value", () => {
  const ass = verAssert(2, defaultValidator);
  const cfgInt = {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "CUSTOM_NODE_ENV",
      appEnv: "CUSTOM_APP_ENV",
    },
  };

  process.env.CUSTOM_NODE_ENV = "invalid";
  process.env.CUSTOM_APP_ENV = "appenv";

  expect(() =>
    ass(
      {
        version: 2,
        expectedNodeEnv: "nodenv",
        expectedAppEnv: "appenv",
      },
      cfgInt,
    ),
  ).toThrowError("Invalid NODE_ENV: expected nodenv, got invalid");
});

it("should assert with default environment value", () => {
  const ass = verAssert(2, defaultValidator);
  const cfgInt = {
    ...defaultCfgCfg,
    envKeys: {
      ...defaultCfgCfg.envKeys,
      nodeEnv: "NONEXIST_NODE_ENV",
      appEnv: "NONEXIST_APP_ENV",
    },
  };

  const result = ass(
    {
      version: 2,
      expectedNodeEnv: "development",
      expectedAppEnv: "development",
    },
    cfgInt,
  );

  expect(result).toBe(true);
});
