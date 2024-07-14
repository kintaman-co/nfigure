export function jsonParser(text: string): Record<string, unknown> {
  return JSON.parse(text);
}

export default jsonParser;
