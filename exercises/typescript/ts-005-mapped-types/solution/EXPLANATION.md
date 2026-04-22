# Solution: Mapped Types Form Builder

## The Bug

The mapped types are too simplistic -- they don't transform field types, remap keys, or separate required/optional fields:

```ts
// BUG: Maps everything to string regardless of field type
export type FormValues<T extends FormSchema> = {
  [K in keyof T]: string;  // should be number for "number" fields, etc.
};

// BUG: Uses original keys instead of get{Name} pattern
export type FormGetters<T extends FormSchema> = {
  [K in keyof T]: () => FormValues<T>[K];  // should be getUsername, not username
};
```

## The Fix

### 1. Conditional type for field value mapping

```ts
// BEFORE
[K in keyof T]: string;

// AFTER
type FieldValueType<F extends FieldConfig> = F["type"] extends "text"
  ? string
  : F["type"] extends "number"
    ? number
    : F["type"] extends "boolean"
      ? boolean
      : F["type"] extends "select"
        ? string
        : never;

export type FormValues<T extends FormSchema> = {
  [K in keyof T]: FieldValueType<T[K]>;
};
```

### 2. Key remapping with template literals

```ts
// BEFORE
export type FormGetters<T extends FormSchema> = {
  [K in keyof T]: () => FormValues<T>[K];
};

// AFTER
export type FormGetters<T extends FormSchema> = {
  [K in keyof T & string as `get${Capitalize<K>}`]: () => FieldValueType<T[K]>;
};
```

### 3. Filtering keys for required/optional

```ts
// BEFORE — everything required
export type FormState<T extends FormSchema> = {
  [K in keyof T]: FormValues<T>[K];
};

// AFTER — required fields mandatory, optional fields optional
export type FormState<T extends FormSchema> = {
  [K in keyof T as T[K]["required"] extends true ? K : never]: FieldValueType<T[K]>;
} & {
  [K in keyof T as T[K]["required"] extends true ? never : K]?: FieldValueType<T[K]>;
};
```

## Why This Matters

Mapped types are the foundation of TypeScript's type transformation system. They power:
- **`Partial<T>`**, **`Required<T>`**, **`Readonly<T>`** -- all are one-line mapped types
- **`Pick<T, K>`**, **`Omit<T, K>`** -- key filtering with mapped types
- Library types like React's `ComponentProps`, Prisma's query types, and tRPC's router types

Key remapping via `as` (added in TS 4.1) combined with template literal types enables patterns like automatically generating getter/setter/handler names from a schema.

## Common Variations

- API response transformers: snake_case keys to camelCase
- Redux: action types to action creator functions
- Event systems: `on${EventName}` handler maps
- ORM query builders: field names to filter functions

## Interview Context

Mapped types and template literal types are advanced TypeScript topics. Being asked to "type a function that generates getters from an object" or "create a type that transforms keys" is common in senior-level TypeScript interviews. Understanding `as` key remapping, `Capitalize`, and conditional types shows deep TypeScript fluency.

## Further Reading

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Key Remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
