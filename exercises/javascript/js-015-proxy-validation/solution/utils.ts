export interface SchemaField {
  type: "string" | "number" | "boolean";
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

export type Schema = Record<string, SchemaField>;

/**
 * Creates a validated object backed by a Proxy.
 * Assignments are validated against the schema.
 * - Type checking: value must match the field's type
 * - Required: required fields cannot be set to undefined/null
 * - min/max: numeric bounds checking
 * - minLength/maxLength: string length checking
 *
 * Throws a descriptive error if validation fails.
 * Only allows setting properties defined in the schema.
 */
export function createValidatedObject<T extends Record<string, unknown>>(
  schema: Schema,
  initial: Partial<T> = {}
): T {
  const target = { ...initial } as Record<string, unknown>;

  const handler: ProxyHandler<Record<string, unknown>> = {
    set(target, prop, value, receiver) {
      const key = String(prop);
      const field = schema[key];

      if (!field) {
        throw new Error(`Property "${key}" is not defined in schema`);
      }

      // Check required
      if (field.required && (value === undefined || value === null)) {
        throw new Error(`Property "${key}" is required`);
      }

      // Allow null/undefined for non-required fields
      if (value !== undefined && value !== null) {
        // Check type
        if (typeof value !== field.type) {
          throw new Error(
            `Property "${key}" must be of type ${field.type}, got ${typeof value}`
          );
        }

        // FIX: Add min/max validation for numbers
        if (field.type === "number" && typeof value === "number") {
          if (field.min !== undefined && value < field.min) {
            throw new Error(
              `Property "${key}" must be at least ${field.min} (min)`
            );
          }
          if (field.max !== undefined && value > field.max) {
            throw new Error(
              `Property "${key}" must be at most ${field.max} (max)`
            );
          }
        }

        // FIX: Add minLength/maxLength validation for strings
        if (field.type === "string" && typeof value === "string") {
          if (field.minLength !== undefined && value.length < field.minLength) {
            throw new Error(
              `Property "${key}" must have at least ${field.minLength} characters (minLength)`
            );
          }
          if (field.maxLength !== undefined && value.length > field.maxLength) {
            throw new Error(
              `Property "${key}" must have at most ${field.maxLength} characters (maxLength)`
            );
          }
        }
      }

      // FIX: Use Reflect.set and return true to indicate success.
      // Without returning true, strict mode throws a TypeError.
      Reflect.set(target, prop, value, receiver);
      return true;
    },

    get(target, prop, receiver) {
      // FIX: Use Reflect.get instead of direct property access.
      // This properly handles inherited properties, getters, and Symbols.
      return Reflect.get(target, prop, receiver);
    },

    has(target, prop) {
      // FIX: Check if the property is in the schema OR on the target.
      // Schema-defined properties should always report as "in" the object.
      return String(prop) in schema || Reflect.has(target, prop);
    },
  };

  return new Proxy(target, handler) as T;
}

/**
 * Creates a readonly view of an object using a Proxy.
 * Any attempt to set, delete, or define properties should throw.
 */
export function createReadonly<T extends Record<string, unknown>>(
  obj: T
): Readonly<T> {
  const handler: ProxyHandler<T> = {
    set(_target, prop) {
      throw new Error(
        `Cannot set property "${String(prop)}" on a readonly object`
      );
    },

    deleteProperty(_target, prop) {
      throw new Error(
        `Cannot delete property "${String(prop)}" from a readonly object`
      );
    },

    get(target, prop, receiver) {
      // FIX: Use Reflect.get for proper property access
      return Reflect.get(target, prop, receiver);
    },
  };

  return new Proxy(obj, handler) as Readonly<T>;
}
