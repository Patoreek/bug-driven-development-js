// Deep merge utility for configuration objects
// Used to merge user-provided settings with defaults

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// BUG: This deep merge does NOT check for dangerous keys like
// __proto__, constructor, or prototype. An attacker can send:
// { "__proto__": { "isAdmin": true } }
// and this will modify Object.prototype, affecting ALL objects.
export function deepMerge(target: PlainObject, source: PlainObject): PlainObject {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      // BUG: Recursively merges without checking if `key` is a
      // prototype-polluting key. When key is "__proto__", this
      // writes to Object.prototype.
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}

// Configuration merge for API settings
export function mergeConfig(
  defaults: PlainObject,
  userConfig: PlainObject
): PlainObject {
  return deepMerge(defaults, userConfig);
}

// Simulates processing a JSON request body (e.g., from Express)
export function processRequestBody(body: unknown): PlainObject {
  if (!isPlainObject(body)) {
    throw new Error("Request body must be a JSON object");
  }

  const defaults: PlainObject = {
    theme: "light",
    notifications: { email: true, sms: false },
    role: "user",
  };

  return mergeConfig(defaults, body as PlainObject);
}
