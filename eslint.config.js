/* eslint-disable */
// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: [
      // ここに無視したいファイルやディレクトリを書く
      "packages/*/dist/**",
      "packages/*/node_modules/**",
      "packages/*/coverage/**",
      "packages/*/jest.config.js",
    ],
  },
);
