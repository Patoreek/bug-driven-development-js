// Deep merge utility for configuration objects
// Used to merge user-provided settings with defaults

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Set of keys that must NEVER be merged — they modify prototypes
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function isDangerousKey(key: string): boolean {
  return DANGEROUS_KEYS.has(key);
}

// FIX: Deep merge that rejects prototype-polluting keys
export function deepMerge(target: PlainObject, source: PlainObject): PlainObject {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    // FIX: Skip dangerous keys that would modify Object.prototype
    if (isDangerousKey(key)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
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
