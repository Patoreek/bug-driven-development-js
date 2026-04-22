# Hint 2 (Medium)

For `validateFile`, test with:
- Empty name (`""`) and whitespace name (`"   "`)
- Size of 0 (empty file)
- Size above 5MB (e.g., `6 * 1024 * 1024`)
- Disallowed types like `"application/javascript"`

For `uploadFile`, use `mockRejectedValueOnce` to simulate:
- `new Error("Request timeout")` -- should return "Upload timed out..."
- `new Error("401 unauthorized")` -- should return "Authentication required..."
- `new Error("413 entity too large")` -- should return "Server rejected..."
- A non-Error value like `"string error"` -- should return "unknown error"
- A resolved value with `{ url: "" }` -- should return "no URL returned"

For `uploadMultipleFiles`, test `[]`, one success + one failure, and all failures.
