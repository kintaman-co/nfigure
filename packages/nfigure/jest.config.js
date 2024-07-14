/**
 * Jestの設定オブジェクトです。
 */
module.exports = {
  /**
   * 使用するプリセットです。
   */
  preset: "ts-jest",
  /**
   * テスト環境です。
   */
  testEnvironment: "node",

  /**
   * テスト対象のファイルパターンです。
   */
  testMatch: ["**/*.test.ts"],

  /**
   * モジュールの拡張子です。
   */
  moduleFileExtensions: ["ts", "js", "json"],

  /**
   * テスト実行前のセットアップファイルです。
   */
  setupFilesAfterEnv: [],

  /**
   * カバレッジの収集を有効にします。
   */
  collectCoverage: true,

  /**
   * カバレッジレポートの出力ディレクトリです。
   */
  coverageDirectory: "coverage",

  /**
   * カバレッジレポートの形式です。
   */
  coverageReporters: ["json", "lcov", "text"],

  /**
   * カバレッジを収集するファイルのパターンです。
   */
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**", "!**/dist/**"],
};
