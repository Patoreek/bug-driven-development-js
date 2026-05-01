# Explanation: Simplify Path

## Why the Bug Happens

The buggy solution handles `..` the same way it handles `.` -- it just skips the token:

```typescript
// BUGGY
if (part === "..") continue; // Skips ".." but doesn't navigate up!
```

In a Unix file system, `..` means "go to the parent directory." If you're at `/a/b` and encounter `..`, you should end up at `/a`. The buggy code ignores `..` entirely, so `/a/b/../c` produces `/a/b/c` instead of `/a/c`.

## The Fix

When encountering `..`, pop the last directory from the stack:

```diff
  for (const part of parts) {
    if (part === "" || part === ".") continue;
-   if (part === "..") continue;
-   result.push(part);
+   if (part === "..") {
+     stack.pop();
+   } else {
+     stack.push(part);
+   }
  }
```

## Visual Walkthrough

For input `"/a/b/../c"`:

```
Split by "/": ["", "a", "b", "..", "c"]

Processing:
  ""   -> skip (empty)
  "a"  -> push -> stack: ["a"]
  "b"  -> push -> stack: ["a", "b"]
  ".." -> pop  -> stack: ["a"]        <-- This is the fix!
  "c"  -> push -> stack: ["a", "c"]

Result: "/" + "a/c" = "/a/c"
```

Buggy version at the `..` step:
```
  ".." -> skip -> stack: ["a", "b"]   <-- Bug: "b" is still there!
  "c"  -> push -> stack: ["a", "b", "c"]

Result: "/a/b/c"  <-- WRONG
```

## Complexity Comparison

| | Time | Space |
|---|---|---|
| Buggy | O(n) | O(n) |
| **Fixed** | **O(n)** | **O(n)** |

Both have the same complexity -- this is a correctness bug, not a performance bug.

## Common Variations

- **File system design** -- this path simplification is a sub-problem in many system design questions
- **Relative path resolution** -- extending to handle relative paths (no leading `/`)
- **Symbolic link resolution** -- more complex version where symlinks must be followed

## Interview Follow-ups

- "What if the path could contain symbolic links?" -- Would need a map of symlink targets and resolve them during traversal
- "How would you handle relative paths?" -- Start with the current working directory on the stack instead of empty
- "What about Windows-style paths with backslashes?" -- Split on both `/` and `\\`, handle drive letters as special root tokens
