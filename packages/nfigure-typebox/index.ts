import { TSchema, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export function typeboxValidator<T extends TSchema>(
  schema: T,
): (config: unknown) => config is Static<T> {
  return (config: unknown): config is Static<T> => {
    return Value.Check(schema, config);
  };
}

export default typeboxValidator;
