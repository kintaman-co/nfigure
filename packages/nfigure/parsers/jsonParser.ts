export function jsonParser() {
  return (text: string): Record<string, unknown> => {
    return JSON.parse(text);
  };
}

export default jsonParser;
