import { Validator } from "../cfgcfg";

export function addType<T>(validator?: Validator<unknown>): Validator<T> {
  if (validator) {
    return validator as Validator<T>;
  } else {
    return (value): value is T => true;
  }
}
export default addType;
