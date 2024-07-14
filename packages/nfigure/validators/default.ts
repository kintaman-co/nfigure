import { Validator } from "../cfgcfg";
import { HelpMeTyping } from "../HelpMeTyping";

export const defaultValidator: Validator<
  Record<string, HelpMeTyping<"全ての型を受理するのでany">>
> = (
  value,
): value is Record<string, HelpMeTyping<"全ての型を受理するのでany">> => true;

export default defaultValidator;
