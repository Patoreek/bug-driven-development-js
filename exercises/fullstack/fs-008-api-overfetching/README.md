# API Overfetching: Returning Unnecessary Data to the Client

**ID:** `fs-008-api-overfetching`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `api-design`, `overfetching`, `performance`, `data-shaping`, `typescript`  
**Prerequisites:** None

---

## The Scenario

Your team has an internal user directory. Different parts of the UI need different amounts of user data: the sidebar only needs names and avatars, team cards need names, roles, and departments, and the profile page needs most fields but should not expose private data like phone numbers and preferences. Currently, every endpoint returns the full user object, which wastes bandwidth, exposes unnecessary data, and slows down the frontend.

## The Bug

All data-fetching functions (`getUsersForList`, `getUsersForCard`, `getUserProfile`) return the complete `User` object with all 12+ fields, regardless of what the caller actually needs. This is classic overfetching -- the API returns far more data than the client requires.

## Your Task

1. Create specific return types using `Pick` or `Omit` for each endpoint
2. Return only the fields each endpoint actually needs
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/userApi.ts` | API functions that return too much data |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [TypeScript Pick and Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html) -- selecting or excluding fields
- [API Design: Overfetching](https://www.apollographql.com/blog/graphql-vs-rest-api-why-and-when-to-use-each) -- REST vs GraphQL tradeoffs
- [Data Transfer Objects](https://martinfowler.com/eaaCatalog/dataTransferObject.html) -- shaping API responses
