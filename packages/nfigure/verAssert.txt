/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigInternal, ValidatorConfig } from "./loader";

export default function verAssert<T extends object>(
  expectedVersion: number,
  validator: ValidatorConfig<T>,
) {
  return (value: unknown, configInternal: ConfigInternal): value is T => {
    const config = value as Record<string, any>;
    if (config.version !== expectedVersion) {
      throw new Error(
        `Invalid version: expected ${expectedVersion}, got ${config.version}`,
      );
    }

    const NODE_ENV =
      process.env[configInternal.envKeys.nodeEnv] || "development";
    const APP_ENV = process.env[configInternal.envKeys.appEnv] || "development";
    if (config.expectedNodeEnv !== NODE_ENV) {
      throw new Error(
        `Invalid NODE_ENV: expected ${config.expectedNodeEnv}, got ${NODE_ENV}`,
      );
    }
    if (config.expectedAppEnv !== APP_ENV) {
      throw new Error(
        `Invalid APP_ENV: expected ${config.expectedAppEnv}, got ${APP_ENV}`,
      );
    }

    return validator(value, configInternal);
  };
}
