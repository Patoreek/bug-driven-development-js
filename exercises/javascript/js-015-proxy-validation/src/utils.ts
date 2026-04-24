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
    set(target, prop, value) {
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

        // BUG: Missing min/max validation for numbers
        // BUG: Missing minLength/maxLength validation for strings
      }

      target[key] = value;
      // BUG: Missing `return true`. In strict mode, a set trap that
      // doesn't return true causes a TypeError.
    },

    get(target, prop) {
      // BUG: Directly accessing target[prop] instead of using Reflect.get.
      // This breaks for inherited properties and Symbol properties.
      return target[String(prop)];
    },

    has(target, prop) {
      // BUG: Should check if the property is in the schema OR on the target,
      // but currently only checks the target.
      return String(prop) in target;
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
      // BUG: Not using Reflect.get -- breaks getters and inherited properties
      return target[prop as keyof T];
    },
  };

  return new Proxy(obj, handler) as Readonly<T>;
}
