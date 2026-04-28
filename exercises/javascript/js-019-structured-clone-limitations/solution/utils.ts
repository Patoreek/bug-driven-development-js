/**
 * Deep clones application state, which may contain various types
 * including functions, Dates, RegExps, Maps, Sets, and class instances.
 *
 * FIX: Separates data (structuredClone-safe) from functions (shared by reference).
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
 * FIX: Extract functions before cloning (structuredClone cannot handle them),
 * deep-clone the data portions, then reattach the function references.
 */
export function cloneAppState(state: AppState): AppState {
  // FIX: Clone the data portions (without functions) using structuredClone.
  // Functions cannot be cloned -- they're shared by reference.
  const { handlers, ...data } = state;

  const clonedData = structuredClone(data);

  return {
    ...clonedData,
    handlers: {
      onUpdate: handlers.onUpdate,
      onError: handlers.onError,
    },
  };
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
 * FIX: Uses structuredClone instead of JSON.parse(JSON.stringify()),
 * which preserves Map, Set, Date, and RegExp types.
 */
export function cloneConfigWithOverrides(
  config: Config,
  overrides: Partial<Config>
): Config {
  // FIX: structuredClone preserves Map, Set, Date, RegExp
  const cloned = structuredClone(config);

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
 * The snapshot is a true deep copy so mutations don't affect it.
 *
 * FIX: Uses structuredClone for a true deep copy instead of
 * the spread operator (which only does a shallow copy).
 */
export function createSnapshot<T extends Record<string, unknown>>(
  obj: T
): T {
  // FIX: structuredClone creates a true deep copy
  return structuredClone(obj);
}
