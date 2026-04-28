/**
 * Deep clones application state, which may contain various types
 * including functions, Dates, RegExps, Maps, Sets, and class instances.
 *
 * BUG: Uses structuredClone for everything, but structuredClone cannot
 * handle functions, Symbols, or DOM nodes. It also does not preserve
 * the prototype chain of class instances.
 */

export interface AppState {
  user: {
    name: string;
    preferences: Map<string, unknown>;
    createdAt: Date;
    pattern: RegExp;
  };
  handlers: {
    onUpdate: (...args: unknown[]) => void;
    onError: (...args: unknown[]) => void;
  };
  tags: Set<string>;
  metadata: Record<string, unknown>;
}

/**
 * Clones application state deeply.
 *
 * BUG: structuredClone throws on functions. This function needs to
 * handle the mixed content -- deep-clone the data parts, but preserve
 * function references (functions are not deep-cloned, just shared).
 */
export function cloneAppState(state: AppState): AppState {
  // BUG: structuredClone cannot clone objects that contain functions.
  // This will throw: DOMException: Failed to execute 'structuredClone'
  return structuredClone(state);
}

/**
 * A serializable configuration that should be safe to clone.
 * Contains only structuredClone-compatible types.
 */
export interface Config {
  database: {
    host: string;
    port: number;
    options: Map<string, string>;
  };
  features: Set<string>;
  createdAt: Date;
  urlPattern: RegExp;
}

/**
 * Clones config and applies overrides.
 *
 * BUG: Uses JSON.parse(JSON.stringify()) for deep cloning, which
 * loses Map, Set, Date, and RegExp types. Should use structuredClone
 * for this data (which contains no functions).
 */
export function cloneConfigWithOverrides(
  config: Config,
  overrides: Partial<Config>
): Config {
  // BUG: JSON round-trip destroys:
  // - Date objects (become strings)
  // - Map objects (become empty objects {})
  // - Set objects (become empty objects {})
  // - RegExp objects (become empty objects {})
  const cloned = JSON.parse(JSON.stringify(config)) as Config;

  // Apply overrides (shallow merge)
  if (overrides.database) {
    cloned.database = { ...cloned.database, ...overrides.database };
  }
  if (overrides.features) {
    cloned.features = overrides.features;
  }
  if (overrides.createdAt) {
    cloned.createdAt = overrides.createdAt;
  }
  if (overrides.urlPattern) {
    cloned.urlPattern = overrides.urlPattern;
  }

  return cloned;
}

/**
 * Creates a snapshot of an object for undo/redo functionality.
 * The snapshot must be a true deep copy so mutations don't affect it.
 *
 * BUG: Uses the spread operator for "deep copy", but spread only
 * does a shallow copy. Nested objects are still shared references.
 */
export function createSnapshot<T extends Record<string, unknown>>(
  obj: T
): T {
  // BUG: Spread only does a shallow copy!
  // Nested objects/arrays are still shared with the original.
  return { ...obj } as T;
}
