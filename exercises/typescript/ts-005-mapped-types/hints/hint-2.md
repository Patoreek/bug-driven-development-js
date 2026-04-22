# Hint 2 (Medium)

You need three TypeScript features:

1. **Conditional types** to map field types to value types:
   ```ts
   type FieldValueType<F extends FieldConfig> = F["type"] extends "number" ? number : ...
   ```

2. **Key remapping with `as`** in mapped types to rename keys:
   ```ts
   { [K in keyof T as `get${Capitalize<K & string>}`]: ... }
   ```

3. **Filtering keys** to separate required from optional fields:
   ```ts
   { [K in keyof T as T[K]["required"] extends true ? K : never]: ... }
   ```

The `Capitalize` utility type is built into TypeScript and converts the first character to uppercase.
