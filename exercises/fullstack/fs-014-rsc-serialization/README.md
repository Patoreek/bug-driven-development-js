# RSC Serialization: Non-Serializable Props Crossing the Server-Client Boundary

**ID:** `fs-014-rsc-serialization`  
**Difficulty:** ★★★★★  
**Estimated Time:** 35 minutes  
**Tags:** `next.js`, `rsc`, `serialization`, `server-components`, `client-components`  
**Prerequisites:** None

---

## The Scenario

Your server component fetches data and passes it as props to a client component. The data includes Date objects, Maps, Sets, and callback functions. In development, things seemed to work, but in production users see wrong dates, missing data, and runtime crashes. The console shows that Date objects became strings, Maps became empty objects, Sets became empty objects, and functions were silently dropped.

## The Bug

React Server Components serialize props using a JSON-like protocol when passing data from server to client components. This protocol cannot handle:

1. **Date objects:** Serialized to ISO strings by `JSON.stringify`, but the client receives a raw string instead of a Date object. Calling `.getFullYear()` on it crashes.

2. **Map objects:** `JSON.stringify(new Map([["a", 1]]))` produces `"{}"`. All entries are lost.

3. **Set objects:** Same as Map — `JSON.stringify(new Set([1, 2, 3]))` produces `"{}"`.

4. **Functions:** Silently dropped during serialization. A `formatter` callback becomes `undefined` on the client.

5. **RegExp objects:** Serialized to `"{}"` — the pattern is lost.

## Your Task

1. Examine `src/serverData.ts` and `src/serialize.ts`
2. Fix `prepareForClient()` to properly serialize all non-JSON-safe types
3. Date should become an ISO string with a type marker for reconstruction
4. Map should become an array of entries `[key, value][]`
5. Set should become an array
6. Functions should be removed and replaced with a string identifier
7. Implement `reconstructOnClient()` to restore the original types from the serialized form

## Files to Modify

| File | Description |
|------|-------------|
| `src/serverData.ts` | Server data with non-serializable types |
| `src/serialize.ts` | Serialization/deserialization utilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [React Server Components](https://react.dev/reference/rsc/server-components) -- serialization boundary
- [Serializable Props](https://react.dev/reference/rsc/use-client#serializable-types) -- what can cross the boundary
- [JSON.stringify Limitations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description) -- what gets lost
