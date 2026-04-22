# Solution: REST API Design

## The Bug

The API violated nearly every REST convention:

| Issue | Before | After |
|-------|--------|-------|
| List users method | `POST` | `GET` |
| List users URL | `/api/getUsers` | `/api/users` |
| Get user method | `POST` | `GET` |
| Get user URL | `/api/fetchUser/:id` | `/api/users/:id` |
| Create user method | `GET` | `POST` |
| Create user URL | `/api/createUser` | `/api/users` |
| Update user method | `POST` | `PUT` |
| Update user URL | `/api/updateUser/:id` | `/api/users/:id` |
| Delete user method | `GET` | `DELETE` |
| Delete user URL | `/api/removeUser/:id` | `/api/users/:id` |
| Create status code | `200` | `201` |
| Delete status code | `200` | `204` |
| Not found status | `200` | `404` |

## The Fix

### 1. Resource-based URLs
Instead of verbs in URLs, use nouns for resources. The HTTP method communicates the action:
- `GET /api/users` -- list users
- `GET /api/users/:id` -- get one user
- `POST /api/users` -- create a user
- `PUT /api/users/:id` -- update a user
- `DELETE /api/users/:id` -- delete a user

### 2. Correct HTTP methods
- `GET` for retrieval (safe, idempotent)
- `POST` for creation (not idempotent)
- `PUT` for full updates (idempotent)
- `DELETE` for removal (idempotent)

### 3. Correct status codes
- `200` -- successful retrieval or update
- `201` -- resource created
- `204` -- successful deletion (no content in body)
- `404` -- resource not found

## Key Takeaway

REST is a set of conventions, not a protocol. Following them makes your API predictable and self-documenting. URLs should identify resources (nouns), HTTP methods should express actions (verbs), and status codes should communicate outcomes. When developers see `DELETE /api/users/42`, they immediately know what it does.
