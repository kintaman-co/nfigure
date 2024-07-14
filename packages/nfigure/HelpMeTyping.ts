// 趣旨より自明にany
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HelpMeTyping<Reason extends string = ""> = any | Reason;

const usage: HelpMeTyping<"型がわからないときに、anyの代わりに使ってください。PRを出すとレビューされます。ここにコメントを書くこともできます。"> =
  {
    [Symbol.for("example")]: "たとえばこの型が分からなかったとしましょう",
    complexType: <T>(arg: T) => arg as keyof typeof usage,
  };
// 趣旨より自明にunused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usage2: HelpMeTyping = "コメントがなくても大丈夫です";
