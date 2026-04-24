export interface AppConfig {
  appName: string;
  version: string;
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  features: {
    darkMode: boolean;
    betaFeatures: string[];
  };
  logging: {
    level: string;
    destinations: string[];
  };
}

/**
 * Creates a deep clone of a config object.
 * Modifying the clone should NEVER affect the original.
 */
export function cloneConfig(config: AppConfig): AppConfig {
  // FIX: Use structuredClone for a true deep copy.
  // All nested objects and arrays get their own copies.
  return structuredClone(config);
}

/**
 * Updates a nested setting in a config object without mutating the original.
 * Returns a new config with the specified path updated to the new value.
 *
 * @param config - The original config (should not be mutated)
 * @param path - Dot-separated path, e.g., "database.port" or "database.credentials.username"
 * @param value - The new value to set
 * @returns A new config object with the updated value
 */
export function updateNestedSetting(
  config: AppConfig,
  path: string,
  value: unknown
): AppConfig {
  // FIX: Deep clone first so we never touch the original
  const updated = structuredClone(config);
  const keys = path.split(".");
  let current: Record<string, unknown> = updated as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return updated as AppConfig;
}

/**
 * Merges overrides into a base config without mutating either object.
 * Performs a deep merge: nested objects should be merged recursively.
 *
 * @param base - Base config
 * @param overrides - Partial overrides to apply
 * @returns A new merged config
 */
export function mergeConfigs(
  base: AppConfig,
  overrides: Partial<Record<string, unknown>>
): AppConfig {
  // FIX: Deep clone the base first, then apply overrides to the clone.
  // This prevents mutation of the original base config.
  const merged = structuredClone(base) as Record<string, unknown>;

  for (const key of Object.keys(overrides)) {
    const overrideVal = overrides[key];
    if (
      overrideVal !== null &&
      typeof overrideVal === "object" &&
      !Array.isArray(overrideVal) &&
      typeof merged[key] === "object" &&
      merged[key] !== null &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = {
        ...(merged[key] as Record<string, unknown>),
        ...(overrideVal as Record<string, unknown>),
      };
    } else {
      merged[key] = overrideVal;
    }
  }

  return merged as AppConfig;
}
