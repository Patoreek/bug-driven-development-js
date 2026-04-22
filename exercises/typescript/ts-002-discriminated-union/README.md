# Discriminated Union Notifications

**ID:** `ts-002-discriminated-union`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `typescript`, `discriminated-unions`, `exhaustive-checking`, `type-narrowing`  
**Prerequisites:** `ts-001-unsafe-any-cast`

---

## The Scenario

Your team maintains a notification system for a SaaS dashboard. There are four notification types -- info, error, progress, and link -- each with different required fields. The current code uses a single flat interface with every field marked optional. Last week, a new "warning" type was added but the formatter was never updated, and nobody noticed because there was no compile-time error. Worse, developers keep creating malformed notifications (like a progress notification without a `total` field) and the bugs only surface in production.

## The Bug

The `Notification` interface uses `type: string` with all fields optional. This means:

- You can create a progress notification without `progress` or `total` fields
- You can access `errorCode` on an info notification without the compiler warning you
- Adding a new notification type won't cause any compile error in `formatNotification`
- The fallback `return notification.title` silently swallows unknown types

## Your Task

1. Replace the single `Notification` interface with a discriminated union type using a literal `type` field
2. Make `formatNotification` use a `switch` statement with an exhaustive check using the `never` type
3. Make `createNotification` type-safe so each type requires its specific fields
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/notifications.ts` | Notification types and formatting logic |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) -- unions with a common literal field
- [Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking) -- using `never` to catch unhandled cases
- [Function overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) -- multiple signatures for one function
