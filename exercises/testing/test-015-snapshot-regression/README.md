# Snapshot Regression: Tests That Hide Bugs

**ID:** `test-015-snapshot-regression`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `testing`, `vitest`, `snapshots`, `regression`, `assertions`  
**Prerequisites:** None

---

## The Scenario

Your team has a user card rendering module used in email templates and SSR pages. A colleague wrote snapshot tests for every function, and whenever the snapshots fail, the team runs `vitest --update` to regenerate them without reviewing the diff. Last month, a bug removed the role badge from user cards and it went unnoticed for two weeks because the snapshot was silently updated. Your tech lead has asked you to replace the brittle snapshot tests with targeted assertions that catch real regressions.

## The Problem

The tests have several issues:

1. **Volatile test data**: `joinedAt: new Date()` produces different output on every run, making snapshots non-deterministic. The tests can only pass after an initial snapshot update.
2. **Over-broad snapshots**: Each test snapshots the entire HTML output. When any detail changes (a class name, a date format, whitespace), the snapshot fails -- but the failure message is a wall of HTML diff that reviewers skip.
3. **No targeted assertions**: If the role badge disappears, the snapshot diff shows the whole card changed. There is no assertion like `expect(html).toContain('role-badge')` that would pinpoint exactly what broke.
4. **Snapshot update culture**: Because the tests fail so often on harmless changes, the team reflexively runs `--update` without reviewing -- hiding real regressions.

## Your Task

1. Replace `new Date()` and relative dates with **fixed dates** (e.g., `new Date("2024-06-15T12:00:00.000Z")`)
2. Replace `toMatchSnapshot()` calls with **targeted assertions** using `toContain`, `not.toContain`, and `toEqual`
3. Each test should verify a **specific behavior** (email shown/hidden, role badge present, inactive class applied, etc.)
4. Add tests for edge cases that the snapshots silently covered (or missed)
5. Do NOT modify the application code in `src/UserCard.ts`

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/UserCard.test.ts` | Snapshot-heavy tests with volatile data and no targeted assertions |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/UserCard.ts` | The correct UserCard rendering module |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest: Snapshot Testing](https://vitest.dev/guide/snapshot) -- when and when not to use snapshots
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing) -- guidelines for snapshot hygiene
- [Testing Library: Guiding Principles](https://testing-library.com/docs/guiding-principles) -- test behavior, not implementation
