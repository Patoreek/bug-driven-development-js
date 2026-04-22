# Test the Error Paths

**ID:** `test-009-error-path-test`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 25 minutes  
**Tags:** `testing`, `vitest`, `error-handling`, `edge-cases`  
**Prerequisites:** None

---

## The Scenario

Your team built a file upload module with thorough error handling -- validation checks, timeout detection, authentication errors, and server rejections are all handled gracefully. The developer who wrote the tests only covered the happy path: valid files that upload successfully. During a production incident, a change to the error message format broke the timeout detection, but the tests didn't catch it. Your tech lead wants full error path coverage added to the test suite.

## The Problem

The existing tests only verify that things work when everything goes right. The `validateFile` function handles 4 different invalid states, `uploadFile` has 6 error branches, and `uploadMultipleFiles` has 3 edge cases -- but none of these are tested. The happy path tests pass, giving false confidence that the module is fully verified.

## Your Task

1. Fix the test file at `src/__tests__/FileUploader.test.ts`
2. Do NOT modify the application code in `src/`
3. Keep the existing happy-path tests and add error/edge case tests
4. Test validation failures, upload errors (timeout, auth, size), non-Error throws, and batch upload edge cases
5. All tests should pass AND cover the error handling logic

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/FileUploader.test.ts` | The test file with missing error coverage |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/FileUploader.ts` | The correct file upload module with error handling |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Testing error cases](https://vitest.dev/api/expect.html#rejects) -- testing rejected promises
- [Mock rejected values](https://vitest.dev/api/mock.html#mockrejectedvalue) -- simulating failures
- [Boundary value testing](https://en.wikipedia.org/wiki/Boundary-value_analysis) -- testing at edges
