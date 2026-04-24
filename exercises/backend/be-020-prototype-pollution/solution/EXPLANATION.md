# Solution: Prototype Pollution — Dangerous Deep Merge

## Why the Bug Happens

JavaScript objects have a prototype chain. Every plain object `{}` inherits from `Object.prototype`. The special `__proto__` property is an accessor that directly references (and can modify) this prototype:

```js
const malicious = JSON.parse('{"__proto__":{"isAdmin":true}}');
// malicious has a key literally named "__proto__" with value {isAdmin: true}

const result = {};
result["__proto__"] = { isAdmin: true };
// This modifies Object.prototype!

const anyObject = {};
console.log(anyObject.isAdmin); // true — EVERY object is affected
```

The `deepMerge` function writes `source[key]` to `result[key]` for every key. When `key` is `"__proto__"`, this writes to `result.__proto__`, which is `Object.prototype`. Now every object in the entire Node.js process inherits the polluted properties.

## The Fix

```ts
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (DANGEROUS_KEYS.has(key)) {
      continue; // Skip prototype-polluting keys
    }
    // ... rest of merge logic
  }

  return result;
}
```

## Why These Three Keys

- `__proto__`: Direct prototype accessor on any object
- `constructor`: Gives access to the constructor function (`Object`), whose `prototype` property is `Object.prototype`
- `prototype`: If merged into a constructor function, modifies what instances inherit

An attacker chain like `{"constructor": {"prototype": {"isAdmin": true}}}` is equivalent to `Object.prototype.isAdmin = true`.

## Real-World Impact

Prototype pollution has caused critical CVEs in:
- **lodash** `_.merge` / `_.defaultsDeep` (CVE-2018-16487)
- **jQuery** `$.extend` (CVE-2019-11358)
- **minimist** argument parser (CVE-2020-7598)

## Documentation

- [Prototype pollution (Snyk)](https://learn.snyk.io/lesson/prototype-pollution/)
- [Object.prototype (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)

## Interview Context

This tests deep JavaScript knowledge:
- Understanding the prototype chain and `__proto__`
- Recognizing that `JSON.parse` can produce keys like `__proto__`
- Knowing that `Object.keys()` does return `__proto__` when it's an own property (from JSON.parse)
- Understanding the real-world security impact of prototype pollution
- Knowing how to defensively program merge utilities
