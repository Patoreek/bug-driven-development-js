# Hint 2 (Medium)

The `sanitize` function needs to:
1. Create a new object (don't mutate the original)
2. Iterate over each key-value pair
3. If the key is in `SENSITIVE_FIELDS`, set the value to `"[REDACTED]"`
4. If the value is a nested object, recursively sanitize it
5. Otherwise, copy the value as-is

Then call `sanitize(body)` in `logRequest` before assigning to the entry.
