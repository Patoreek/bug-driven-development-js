# Proxy Validation Pitfalls

**ID:** `js-015-proxy-validation`
**Difficulty:** ★★★★☆
**Estimated Time:** 25 minutes
**Tags:** `javascript`, `proxy`, `reflect`, `validation`, `metaprogramming`
**Prerequisites:** None

---

## The Scenario

Your team built a schema validation layer using JavaScript Proxies. The idea is elegant: create objects that automatically validate any property assignment against a schema. If someone tries to set `user.age = "not a number"`, the Proxy throws an error. It worked in initial testing, but production revealed several issues: some assignments silently fail, inherited properties break, and the `has` trap reports wrong results.

## The Bug

The Proxy handler has multiple issues:
1. The `set` trap doesn't return `true` after a successful set, which causes a `TypeError` in strict mode
2. The `get` trap accesses the target directly instead of using `Reflect.get`, which breaks for inherited properties and getters
3. The validation logic doesn't handle all schema constraint types (missing min/max checks)

## Your Task

1. Fix the `set` trap to return `true` on success
2. Fix the `get` trap to use `Reflect.get` properly
3. Fix the validation logic to handle all schema constraints
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/utils.ts` | Buggy Proxy-based validation |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) -- creating proxies
- [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) -- trap counterparts
- [MDN: handler.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set) -- return value requirements
