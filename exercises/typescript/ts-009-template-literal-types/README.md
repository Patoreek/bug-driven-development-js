# Template Literal Types: String Manipulation at the Type Level

**ID:** `ts-009-template-literal-types`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `typescript`, `template-literal-types`, `string-manipulation`, `mapped-types`, `intrinsic-types`
**Prerequisites:** `ts-008-conditional-types`

---

## The Scenario

Your team is building a type-safe routing and CSS-in-JS library. You have several utility types that transform strings at the type level: converting event names to handler names (`"click"` to `"onClick"`), camelCase CSS properties to kebab-case (`"fontSize"` to `"font-size"`), extracting route parameters from path templates, generating dot-notation paths for nested objects, and splitting strings by delimiters. However, each utility has a subtle bug that causes incorrect type output.

## The Bug

Five template literal type utilities have issues:

1. **`EventName<T>`** produces `"onclick"` instead of `"onClick"` -- it prepends `"on"` but doesn't capitalize the first letter of the event name.

2. **`CSSProperty<T>`** inserts a hyphen before uppercase letters but doesn't convert them to lowercase, producing `"font-Size"` instead of `"font-size"`.

3. **`PathParam<T>`** extracts route parameters but includes the colon prefix, producing `":id"` instead of `"id"`.

4. **`DotPath<T>`** builds nested access paths using `/` instead of `.` as the separator, and doesn't include top-level keys as standalone paths.

5. **`Split<T, D>`** splits a string into a tuple by delimiter but builds the tuple in reverse order, producing `["c", "b", "a"]` instead of `["a", "b", "c"]`.

## Your Task

1. Examine `src/templateLiteralTypes.ts`
2. Fix `EventName` to capitalize the first letter of the event using the `Capitalize` intrinsic type
3. Fix `CSSProperty` to emit lowercase letters after the hyphen using the `Lowercase` intrinsic type
4. Fix `PathParam` to return parameter names without the colon prefix
5. Fix `DotPath` to use `.` as the separator and include top-level keys
6. Fix `Split` to produce the tuple in the correct (left-to-right) order
7. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/templateLiteralTypes.ts` | Template literal type utilities with incorrect string transformations |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) -- string manipulation in the type system
- [Intrinsic String Manipulation Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types) -- Capitalize, Lowercase, Uppercase, Uncapitalize
- [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types) -- pattern matching with infer
