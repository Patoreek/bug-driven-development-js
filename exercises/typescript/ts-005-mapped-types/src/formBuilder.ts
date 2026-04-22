// BUG: This module builds a type-safe form system using mapped types.
// The current implementation has several issues with how mapped types
// and template literal types are used, leading to incorrect types AND
// incorrect runtime behavior.

export interface FieldConfig {
  type: "text" | "number" | "boolean" | "select";
  required: boolean;
  label: string;
  options?: string[]; // only for "select" type
}

export type FormSchema = Record<string, FieldConfig>;

// BUG: This mapped type should convert field configs to their runtime value types
// but it maps everything to `string` regardless of the field type.
export type FormValues<T extends FormSchema> = {
  [K in keyof T]: string;
};

// BUG: This should make only the required fields mandatory and optional fields optional.
// Currently it makes everything required.
export type FormState<T extends FormSchema> = {
  [K in keyof T]: FormValues<T>[K];
};

// BUG: Getter function names should be `get${Capitalize<K>}` using template literals
// but currently they're just the key names
export type FormGetters<T extends FormSchema> = {
  [K in keyof T]: () => FormValues<T>[K];
};

// BUG: Setter function names should be `set${Capitalize<K>}` using template literals
export type FormSetters<T extends FormSchema> = {
  [K in keyof T]: (value: FormValues<T>[K]) => void;
};

// BUG: Should create an "on{FieldName}Change" event handler map
export type FormHandlers<T extends FormSchema> = {
  [K in keyof T]: (value: FormValues<T>[K]) => void;
};

// BUG: Because FormValues maps everything to `string`, the runtime implementation
// also converts everything to strings to match the type. This means numbers and
// booleans are stored as strings.
export function createFormValues<T extends FormSchema>(
  schema: T,
  initial: Record<string, unknown> = {}
): FormValues<T> {
  const values: Record<string, unknown> = {};

  for (const [key, config] of Object.entries(schema)) {
    if (key in initial) {
      // BUG: Converts all initial values to strings to match the FormValues type
      values[key] = String(initial[key]);
    } else {
      // BUG: All defaults are strings because the type says so
      switch (config.type) {
        case "text":
          values[key] = "";
          break;
        case "number":
          values[key] = "0";
          break;
        case "boolean":
          values[key] = "false";
          break;
        case "select":
          values[key] = config.options?.[0] ?? "";
          break;
      }
    }
  }

  return values as FormValues<T>;
}

export function createFormGetters<T extends FormSchema>(
  schema: T,
  values: FormValues<T>
): FormGetters<T> {
  const getters: Record<string, () => unknown> = {};

  for (const key of Object.keys(schema)) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    getters[`get${capitalizedKey}`] = () => values[key as keyof typeof values];
  }

  return getters as FormGetters<T>;
}

export function createFormSetters<T extends FormSchema>(
  schema: T,
  values: FormValues<T>
): FormSetters<T> {
  const setters: Record<string, (value: unknown) => void> = {};

  for (const key of Object.keys(schema)) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    setters[`set${capitalizedKey}`] = (value: unknown) => {
      (values as Record<string, unknown>)[key] = value;
    };
  }

  return setters as FormSetters<T>;
}
