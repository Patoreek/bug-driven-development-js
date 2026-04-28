# structuredClone Limitations

**ID:** `js-019-structured-clone-limitations`
**Difficulty:** ★★★★☆
**Estimated Time:** 20 minutes
**Tags:** `javascript`, `structuredClone`, `deep-copy`, `serialization`, `json`
**Prerequisites:** None

---

## The Scenario

Your team manages application state that needs to be deep-cloned in several contexts: creating undo/redo snapshots, cloning configuration with overrides, and duplicating complex state objects. Different team members used different cloning approaches -- `structuredClone`, `JSON.parse(JSON.stringify())`, and the spread operator -- without understanding the limitations of each. The result: functions cause runtime crashes, Maps and Sets silently become empty objects, and "deep copies" turn out to be shallow.

## The Bug

Three cloning functions, three different problems:

1. **`cloneAppState`**: Uses `structuredClone` on an object containing functions. `structuredClone` throws a `DOMException` because functions are not cloneable by the structured clone algorithm.
2. **`cloneConfigWithOverrides`**: Uses `JSON.parse(JSON.stringify())` to clone an object containing `Map`, `Set`, `Date`, and `RegExp`. JSON serialization silently destroys these types -- Maps and Sets become `{}`, Dates become strings, RegExps become `{}`.
3. **`createSnapshot`**: Uses the spread operator (`{ ...obj }`) for "deep copy", but spread only copies one level deep. Nested objects are still shared references.

## Your Task

1. Fix `cloneAppState` to separate functions (shared by reference) from data (deep-cloned with `structuredClone`)
2. Fix `cloneConfigWithOverrides` to use `structuredClone` instead of JSON round-tripping (the config contains no functions, so it is safe)
3. Fix `createSnapshot` to use `structuredClone` for a true deep copy
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy deep cloning utilities |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) -- the structured clone algorithm
- [MDN: Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) -- what can and cannot be cloned
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) -- serialization limitations
