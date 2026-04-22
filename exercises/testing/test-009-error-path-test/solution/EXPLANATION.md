# Explanation: Missing Error Path Tests

## Why the Tests Were Flawed

The original tests only covered the **happy path** -- valid files that upload successfully. This is the most common testing gap in real-world codebases. The code has careful error handling for validation failures, network timeouts, authentication errors, and server rejections, but none of that logic was tested. If any error handling code broke, the tests would still pass.

Studies consistently show that **most production bugs occur in error handling code**, not in the happy path. If you only test the sunny day scenario, you're leaving the most fragile code unverified.

## What Was Missing

```ts
// BEFORE: Only happy path tests
describe("validateFile", () => {
  it("should accept a valid file", () => { ... }); // The only test!
  // Missing: empty name, zero size, oversized, wrong type
});

describe("uploadFile", () => {
  it("should upload successfully", () => { ... }); // The only test!
  // Missing: timeout, auth error, size rejection, non-Error throws, no URL
});
```

The source has 13+ distinct error branches, but only 3 tests total -- all happy path.

## What Good Error Testing Looks Like

```ts
// AFTER: Comprehensive error coverage

// Validation edge cases
it("should reject a file with empty name", () => {
  const result = validateFile({ name: "", size: 1024, type: "image/jpeg" });
  expect(result.valid).toBe(false);
  expect(result.error).toBe("File name is required");
});

// Boundary testing
it("should accept a file exactly at the maximum size", () => {
  const result = validateFile({ name: "max.jpg", size: 5 * 1024 * 1024, type: "image/jpeg" });
  expect(result.valid).toBe(true);
});

// Error type differentiation
it("should handle timeout errors", async () => {
  mockUploadFn.mockRejectedValueOnce(new Error("Request timeout"));
  const result = await uploadFile(validFile, mockUploadFn);
  expect(result.error).toBe("Upload timed out. Please try again.");
});

// Non-Error thrown values
it("should handle non-Error thrown values", async () => {
  mockUploadFn.mockRejectedValueOnce("string error");
  const result = await uploadFile(validFile, mockUploadFn);
  expect(result.error).toBe("Upload failed due to an unknown error");
});

// Partial batch failures
it("should handle partial failures", async () => {
  mockUploadFn
    .mockResolvedValueOnce({ url: "..." })
    .mockRejectedValueOnce(new Error("Network error"));
  const result = await uploadMultipleFiles(files, mockUploadFn);
  expect(result.allSucceeded).toBe(false);
  expect(result.results[0].success).toBe(true);
  expect(result.results[1].success).toBe(false);
});
```

## Error Testing Strategies

1. **Validation boundaries** -- test at the exact limit (e.g., max size), just above, and just below
2. **Error type differentiation** -- verify different errors produce different user-facing messages
3. **Non-standard throws** -- test what happens when `throw "string"` or `throw 42` occurs
4. **Partial failures** -- in batch operations, test mixes of success and failure
5. **Empty inputs** -- test empty arrays, empty strings, zero values

## Interview Context

Error path testing is a strong signal of engineering maturity:
- "How do you decide what to test beyond the happy path?"
- "What's the relationship between error handling code and test coverage?"
- "How would you test a function that handles 5 different error types?"

The key insight: **the code you're least confident about is the code that most needs tests**. Error handling code runs rarely in development but frequently in production -- it needs the most rigorous testing.
