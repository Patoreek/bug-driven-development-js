# Hint 3 (Strong)

Here are the corrected type definitions:

```ts
// Map field config type to runtime value type
type FieldValueType<F extends FieldConfig> = F["type"] extends "text"
  ? string
  : F["type"] extends "number"
    ? number
    : F["type"] extends "boolean"
      ? boolean
      : F["type"] extends "select"
        ? string
        : never;

// Each field maps to its correct runtime type
export type FormValues<T extends FormSchema> = {
  [K in keyof T]: FieldValueType<T[K]>;
};

// Getters with remapped keys: getUsername, getAge, etc.
export type FormGetters<T extends FormSchema> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => FieldValueType<T[K]>;
};

// Setters with remapped keys: setUsername, setAge, etc.
export type FormSetters<T extends FormSchema> = {
  [K in keyof T & string as `set${Capitalize<K>}`]: (value: FieldValueType<T[K]>) => void;
};
```

Note: `K & string` or `keyof T & string` is needed because `Capitalize` only works on string types, and `keyof T` could include `number` or `symbol`.
