# Mapped Types Form Builder

**ID:** `ts-005-mapped-types`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `typescript`, `mapped-types`, `template-literal-types`, `conditional-types`, `form`  
**Prerequisites:** `ts-003-generic-constraints`

---

## The Scenario

Your team is building a type-safe form library. The idea is that developers define a schema (field names, types, required/optional) and the library generates correctly-typed values, getters, setters, and event handlers. The runtime code works, but the TypeScript types are wrong -- `FormValues` maps everything to `string` regardless of the field type, the getters/setters use the raw field names instead of `get{Name}`/`set{Name}`, and required vs optional fields aren't distinguished.

## The Bug

Several mapped type definitions are incorrect:

- `FormValues<T>` maps every field to `string` instead of deriving the value type from the field's `type` property (text->string, number->number, boolean->boolean)
- `FormGetters<T>` and `FormSetters<T>` use the original key names instead of remapped names like `getUsername` / `setUsername`
- `FormState<T>` doesn't distinguish required from optional fields
- `FormHandlers<T>` doesn't use `on{Name}Change` naming

## Your Task

1. Fix `FormValues` to map field types to their correct runtime types using conditional types
2. Fix `FormGetters` and `FormSetters` to use template literal type key remapping (`get${Capitalize<K>}`)
3. Fix `FormState` to make required fields mandatory and optional fields optional
4. Fix `FormHandlers` to use `on${Capitalize<K>}Change` naming
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/formBuilder.ts` | Form builder types and runtime implementation |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) -- transforming types with `[K in keyof T]`
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) -- string manipulation at the type level
- [Key Remapping](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as) -- `as` clause in mapped types
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) -- `T extends U ? X : Y`
