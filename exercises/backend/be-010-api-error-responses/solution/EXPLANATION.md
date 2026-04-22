# Solution: API Error Responses

## The Bug

The API handlers returned errors in three different formats:
- `{ error: "..." }` (flat string)
- `{ message: "..." }` (different key)
- `{ msg: "..." }` (yet another key)

Status codes were also wrong:
- Validation errors returned 500 (server error) instead of 400 (bad request)
- Not found errors returned 200 (OK) or 500 instead of 404

## The Fix

1. Created a helper function `errorResponse()` that produces a consistent format:
```ts
function errorResponse(status: number, code: string, message: string): ApiResponse {
  return { status, body: { error: { code, message } } };
}
```

2. Replaced all inconsistent error returns with calls to this helper:
- Validation errors: `errorResponse(400, "VALIDATION_ERROR", "...")`
- Not found errors: `errorResponse(404, "NOT_FOUND", "...")`

## Key Takeaway

Consistent error response formats are essential for API consumers. A standard shape like `{ error: { code, message } }` with correct HTTP status codes lets frontend code write a single error handler instead of special-casing each endpoint. Consider creating a shared error response factory for your API.
