import typeboxValidator from "typeboxValidator";
import { load } from "./loader";
import { Type } from "@sinclair/typebox";
import verAssert from "verAssert";

const dbSchema = Type.Union(
  [
    Type.Object({
      type: Type.Literal("sqlite"),
      filename: Type.String(),
    }),
    Type.Object({
      type: Type.Literal("mysql"),
      host: Type.String(),
      port: Type.Integer(),
      username: Type.String(),
      password: Type.String(),
      database: Type.String(),
    }),
  ],
  {
    description: "データベースの設定です。",
  },
);

const CURRENT_VERSION = 1;

export const configSchema = Type.Object({
  logLevel: Type.String({
    enum: ["error", "warn", "info", "http", "verbose", "debug", "silly"],
    description:
      "ログレベルです。詳細はwinstonのドキュメントを参照してください。",
  }),
  port: Type.Integer({
    minimum: 0,
    maximum: 65535,
    description: "サーバーがリッスンするポート番号です。",
  }),
  db: Type.Optional(dbSchema),
  cors: Type.Optional(
    Type.Object({
      origin: Type.String(),
      methods: Type.Array(Type.String()),
    }),
  ),
});

export const config = load({
  validator: typeboxValidator(configSchema),
});

export const configPlain = load({});

export const configTwo = load({
  validator: verAssert(CURRENT_VERSION, typeboxValidator(configSchema)),
});
