# Module Augmentation

**ID:** `ts-006-module-augmentation`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `typescript`, `declaration-merging`, `module-augmentation`, `express`, `middleware`  
**Prerequisites:** `ts-002-discriminated-union`

---

## The Scenario

Your team uses an Express-like framework with typed Request and Response interfaces. Several middlewares need to attach custom properties -- `user` (from auth), `requestId` (from tracing), and `locals` (for template data). A developer created separate interfaces (`ExtendedRequest`, `ExtendedResponse`) and used intersection types (`Request & ExtendedRequest`) in each middleware. This works in isolation but breaks down when composing middlewares into a pipeline: the types are incompatible because each middleware expects a different intersection type, not the base `Request`.

## The Bug

Instead of augmenting the original `Request` and `Response` interfaces through declaration merging, the code creates separate `ExtendedRequest` and `ExtendedResponse` interfaces and uses intersection types. This causes:

- Middleware functions have incompatible signatures with the `Middleware` type
- `getUserRole(req: Request)` can't access `req.user` without an `as any` cast
- `createPipeline` can't accept the extended middlewares because their parameter types don't match
- Each middleware has a slightly different intersection type, making composition impossible

## Your Task

1. Merge the custom properties directly into the `Request` and `Response` interfaces
2. Remove the separate `ExtendedRequest` and `ExtendedResponse` interfaces
3. Update all middleware signatures to use the base `Request`/`Response` types
4. Remove all `as any` casts
5. Ensure all middleware functions are compatible with the `Middleware` type
6. Ensure all tests pass
7. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/express-ext.ts` | Express-like types with incorrect augmentation pattern |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) -- how TypeScript combines multiple declarations
- [Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) -- extending third-party types
- [Interface Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) -- combining interface declarations
