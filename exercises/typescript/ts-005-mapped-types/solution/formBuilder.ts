export interface FieldConfig {
  type: "text" | "number" | "boolean" | "select";
  required: boolean;
  label: string;
  options?: string[];
}

export type FormSchema = Record<string, FieldConfig>;

// FIX: Map field config types to their runtime value types
type FieldValueType<F extends FieldConfig> = F["type"] extends "text"
  ? string
  : F["type"] extends "number"
    ? number
    : F["type"] extends "boolean"
      ? boolean
      : F["type"] extends "select"
        ? string
        : never;

// FIX: Each field maps to its correct runtime type
export type FormValues<T extends FormSchema> = {
  [K in keyof T]: FieldValueType<T[K]>;
};

// FIX: Required fields are mandatory, optional fields are optional
export type FormState<T extends FormSchema> = {
  [K in keyof T as T[K]["required"] extends true ? K : never]: FieldValueType<T[K]>;
} & {
  [K in keyof T as T[K]["required"] extends true ? never : K]?: FieldValueType<T[K]>;
};

// FIX: Template literal type for getter names: `get${Capitalize<K>}`
export type FormGetters<T extends FormSchema> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => FieldValueType<T[K]>;
};

// FIX: Template literal type for setter names: `set${Capitalize<K>}`
export type FormSetters<T extends FormSchema> = {
  [K in keyof T & string as `set${Capitalize<K>}`]: (value: FieldValueType<T[K]>) => void;
};

// FIX: Template literal type for handler names: `on${Capitalize<K>}Change`
export type FormHandlers<T extends FormSchema> = {
  [K in keyof T & string as `on${Capitalize<K>}Change`]: (value: FieldValueType<T[K]>) => void;
};

export function createFormValues<T extends FormSchema>(
  schema: T,
  initial: Record<string, unknown> = {}
): FormValues<T> {
  const values: Record<string, unknown> = {};

  for (const [key, config] of Object.entries(schema)) {
    if (key in initial) {
      values[key] = initial[key];
    } else {
      switch (config.type) {
        case "text":
          values[key] = "";
          break;
        case "number":
          values[key] = 0;
          break;
        case "boolean":
          values[key] = false;
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
