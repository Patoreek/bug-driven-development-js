# Solution: Logging Sensitive Data

## The Bug

Two issues:

1. The `sanitize` function was a no-op -- it returned the input object unchanged:
```ts
export function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  return obj; // Does nothing!
}
```

2. The `logRequest` function passed the raw body to the log entry without calling `sanitize`:
```ts
body, // Raw, unsanitized body with passwords, tokens, etc.
```

## The Fix

1. **Implemented `sanitize`** to iterate over object keys, check against the sensitive fields list, and recursively handle nested objects:
```ts
export function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.includes(key)) {
      result[key] = "[REDACTED]";
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitize(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

2. **Applied sanitization in `logRequest`**:
```ts
body: sanitize(body),
```

Key details:
- Creates a new object (doesn't mutate the original)
- Recursively handles nested objects
- Checks the `SENSITIVE_FIELDS` array which already contained the right field names

## Key Takeaway

Never log raw request bodies. Passwords, tokens, credit card numbers, and other PII should never appear in log files. Implement a sanitization layer that runs before every log write, and maintain a list of sensitive field names to redact. This is often a regulatory requirement (GDPR, PCI-DSS, HIPAA).
