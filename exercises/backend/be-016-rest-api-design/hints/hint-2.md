# Hint 2 (Medium)

REST convention for a "users" resource:
- **List all:** `GET /api/users`
- **Get one:** `GET /api/users/:id`
- **Create:** `POST /api/users`
- **Update:** `PUT /api/users/:id`
- **Delete:** `DELETE /api/users/:id`

Also check the status codes: creation should return 201, successful deletion should return 204, and "not found" should return 404.
