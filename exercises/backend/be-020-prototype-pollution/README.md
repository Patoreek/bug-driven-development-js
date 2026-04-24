# Prototype Pollution: Dangerous Deep Merge

**ID:** `be-020-prototype-pollution`  
**Difficulty:** ★★★★★  
**Estimated Time:** 30 minutes  
**Tags:** `security`, `prototype-pollution`, `deep-merge`, `object-prototype`, `injection`  
**Prerequisites:** None

---

## The Scenario

Your API has a configuration merge utility that deep-merges user-provided settings with server defaults. A penetration test reveals that an attacker can send a specially crafted JSON body like `{"__proto__": {"isAdmin": true}}` and elevate their privileges. After processing this request, **every object in the application** has `isAdmin === true` because `Object.prototype` was modified.

## The Bug

The `deepMerge` function iterates over all keys in the source object without checking if any key is a **prototype-polluting** key (`__proto__`, `constructor`, `prototype`). When the function encounters `__proto__` as a key, it writes to `Object.prototype`, which is shared by all objects in the JavaScript runtime. This is one of the most dangerous vulnerabilities in Node.js applications.

## Your Task

1. Identify the dangerous keys that can modify prototypes
2. Add guards to `deepMerge` to reject these keys
3. Ensure legitimate keys are still merged correctly
4. All tests must pass (including prototype pollution prevention tests)

## Files to Modify

| File | Description |
|------|-------------|
| `src/merge.ts` | Deep merge utility vulnerable to prototype pollution |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Prototype pollution explained](https://learn.snyk.io/lesson/prototype-pollution/) -- Snyk security lesson
- [Object.prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype) -- how the prototype chain works
- [__proto__ vs prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) -- the dangerous accessor
