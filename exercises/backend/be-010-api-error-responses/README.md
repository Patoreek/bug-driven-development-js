# API Error Responses

**ID:** `be-010-api-error-responses`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `api`, `error-handling`, `http`, `status-codes`, `consistency`  
**Prerequisites:** None

---

## The Scenario

You've joined a team maintaining a REST API for a task management app. Frontend developers are frustrated because error responses from different endpoints use different formats -- some return `{ error: "..." }`, others return `{ message: "..." }`, and others return `{ msg: "..." }`. Status codes are inconsistent too: one endpoint returns 200 for "not found" while another returns 500. The frontend team needs a consistent contract to build reliable error handling.

## The Bug

The API handlers return errors in at least three different formats and use incorrect HTTP status codes. A "not found" error sometimes returns 200 or 500 instead of 404. Validation errors return 500 instead of 400. The response shape changes depending on which endpoint you hit.

## Your Task

1. Examine `src/handlers.ts` and identify the inconsistent error formats and wrong status codes
2. Standardize all error responses to use the format: `{ error: { code: string, message: string } }`
3. Use correct HTTP status codes: 400 for validation, 404 for not found, 500 for server errors
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/handlers.ts` | API handler functions with inconsistent error responses |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) -- standard status code meanings
- [REST API Error Handling](https://www.rfc-editor.org/rfc/rfc7807) -- Problem Details for HTTP APIs
- [API Design Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design) -- consistent error formats
