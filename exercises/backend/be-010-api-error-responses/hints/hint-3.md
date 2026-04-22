# Hint 3 (Strong)

Create a helper function like:

```ts
function errorResponse(status: number, code: string, message: string): ApiResponse {
  return { status, body: { error: { code, message } } };
}
```

Then replace every error return with:
- `errorResponse(400, "VALIDATION_ERROR", "...")` for validation failures
- `errorResponse(404, "NOT_FOUND", "...")` for missing resources
