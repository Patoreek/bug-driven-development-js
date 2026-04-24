# Fix the Copy-Paste Test Suite

**ID:** `test-013-parameterized-test`
**Difficulty:** ★★★★☆
**Estimated Time:** 20 minutes
**Tags:** `testing`, `vitest`, `parameterized-tests`, `it-each`, `DRY`
**Prerequisites:** None

---

## The Scenario

Your team has a `validatePassword` function with many validation rules: minimum/maximum length, character type requirements, repeated character detection, whitespace check, and common password patterns. A developer wrote 20+ individual test cases, each copy-pasting the same pattern of calling `validatePassword` and checking `valid`/`errors`. Over time, copy-paste bugs crept in: expected errors were pasted from the wrong test, strength expectations are wrong, and error counts are hardcoded. Adding a new rule requires duplicating 10+ lines per test case.

## The Problem

1. **Massive duplication**: Every test follows the exact same pattern but differs only in the input password and expected output
2. **Copy-paste bugs**: At least 3 tests have wrong expected values pasted from other tests
3. **Hardcoded counts**: The "multiple errors" test asserts `toHaveLength(3)` but the password actually produces 4 errors
4. **Maintenance burden**: Adding a new test case means duplicating the entire test body and changing 2 values
5. **Inconsistent structure**: Some tests check `valid + errors`, others check `strength`, with no logical grouping

## Your Task

1. Fix the test file at `src/__tests__/validatePassword.test.ts`
2. Do NOT modify the application code in `src/validatePassword.ts`
3. Replace duplicated tests with `it.each` data tables
4. Fix all copy-paste bugs (wrong expected errors, wrong strength ratings, wrong counts)
5. Group related tests using `describe` blocks
6. Make it trivial to add a new test case (just one new row in a table)

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/validatePassword.test.ts` | 20+ copy-pasted tests with subtle bugs |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/validatePassword.ts` | The correct password validation function |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Vitest: it.each](https://vitest.dev/api/#test-each) -- parameterized test cases
- [Vitest: describe.each](https://vitest.dev/api/#describe-each) -- parameterized test suites
- [DRY Testing](https://kentcdodds.com/blog/aha-testing) -- AHA Testing over DRY testing
