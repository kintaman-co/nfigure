// https://github.com/pierreinglebert/json-merge-patch (MIT License) より借用
// ほぼそのままコピーしているのでanyで許して
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize(value: any) {
  return value && typeof value.toJSON === "function" ? value.toJSON() : value;
}
// 同上
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyPatch(target: any, patch: any) {
  patch = serialize(patch);
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch;
  }

  target = serialize(target);
  if (target === null || typeof target !== "object" || Array.isArray(target)) {
    target = {};
  }
  const keys = Object.keys(patch);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return target;
    }
    if (key in patch && patch[key] === null) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        // 同上
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete target[key];
      }
    } else {
      target[key] = applyPatch(target[key], patch[key]);
    }
  }
  return target;
}
