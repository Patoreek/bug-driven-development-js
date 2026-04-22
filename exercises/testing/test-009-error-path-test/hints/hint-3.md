# Hint 3 (Strong)

Here are the key error tests to add:

```ts
// Validation errors
it("should reject empty file name", () => {
  const result = validateFile({ name: "", size: 1024, type: "image/jpeg" });
  expect(result.valid).toBe(false);
  expect(result.error).toBe("File name is required");
});

it("should reject oversized file", () => {
  const result = validateFile({ name: "huge.jpg", size: 6 * 1024 * 1024, type: "image/jpeg" });
  expect(result.valid).toBe(false);
  expect(result.error).toContain("exceeds maximum size");
});

// Upload errors
it("should handle timeout", async () => {
  mockUploadFn.mockRejectedValueOnce(new Error("Request timeout"));
  const result = await uploadFile(validFile, mockUploadFn);
  expect(result.error).toBe("Upload timed out. Please try again.");
});

it("should handle non-Error throws", async () => {
  mockUploadFn.mockRejectedValueOnce("string error");
  const result = await uploadFile(validFile, mockUploadFn);
  expect(result.error).toBe("Upload failed due to an unknown error");
});

// Batch edge cases
it("should handle empty array", async () => {
  const result = await uploadMultipleFiles([], mockUploadFn);
  expect(result.results).toHaveLength(0);
  expect(result.allSucceeded).toBe(true);
});
```
