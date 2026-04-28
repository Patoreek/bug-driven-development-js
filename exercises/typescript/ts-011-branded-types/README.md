# Branded Types: Nominal Typing in a Structural World

**ID:** `ts-011-branded-types`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `typescript`, `branded-types`, `nominal-typing`, `type-safety`, `phantom-types`
**Prerequisites:** `ts-003-generic-constraints`

---

## The Scenario

Your e-commerce platform has a critical bug in production: an order was processed with a product ID where a user ID was expected, and a EUR amount was charged to a USD account. The root cause is that all IDs are plain `string` and all monetary amounts are plain `number` -- TypeScript's structural type system treats them as interchangeable. Your team decided to implement branded types to make IDs and currencies nominally typed, but the implementation has several mistakes that leave the type holes wide open.

## The Bug

The branded types system has multiple issues:

1. **`Brand<T, B>` uses a plain `__brand` property** instead of a unique symbol key, so the brand could be accidentally satisfied by any object with a `__brand` field.

2. **All ID types use the same brand string `"id"`**, making `UserId`, `OrderId`, and `ProductId` structurally identical -- you can pass a `UserId` where an `OrderId` is expected.

3. **Validation functions return plain `string`/`number`** instead of the branded types, so the type system doesn't track which values have been validated.

4. **Currency types use the same brand `"currency"`**, making `USD` and `EUR` interchangeable.

5. **`processOrder` and `calculateTotal` accept plain unbranded types**, defeating the entire purpose of the branding system.

## Your Task

1. Examine `src/brandedTypes.ts`
2. Fix the `Brand` type to use a unique symbol key (`[__brand]`) instead of a plain `__brand` property
3. Give each ID type a unique brand string (`"UserId"`, `"OrderId"`, `"ProductId"`)
4. Give each currency type a unique brand string (`"USD"`, `"EUR"`)
5. Fix the constructor functions to return branded types (using `as` assertions after validation)
6. Fix `processOrder` to require branded ID types in its signature
7. Fix `calculateTotal` to require `USD` for the price parameter and return `USD`
8. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/brandedTypes.ts` | Branded type system with weak branding, shared brands, and unbranded return types |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Unique Symbol](https://www.typescriptlang.org/docs/handbook/symbols.html) -- creating truly unique type keys
- [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) -- using `as` for safe narrowing
- [Structural vs Nominal Typing](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) -- why TypeScript needs branding patterns
