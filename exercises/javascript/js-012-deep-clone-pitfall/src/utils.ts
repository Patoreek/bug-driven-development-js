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
  // BUG: Spread only performs a shallow clone.
  // Nested objects (database, features, logging) are shared references.
  return { ...config };
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
  // BUG: This shallow-clones the top level, but then directly mutates
  // nested objects — which are still shared with the original.
  const updated = { ...config };
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
  // BUG: Object.assign is also a shallow operation.
  // Nested override objects replace the entire nested base object
  // instead of merging properties, AND the base gets mutated.
  return Object.assign(base, overrides) as AppConfig;
}
