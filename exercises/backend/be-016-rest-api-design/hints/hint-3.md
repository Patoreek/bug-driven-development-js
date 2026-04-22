# Hint 3 (Strong)

Fix each route definition:
```ts
getListUsersRoute()    -> { method: "GET",    path: "/api/users" }
getGetUserRoute(id)    -> { method: "GET",    path: `/api/users/${id}` }
getCreateUserRoute()   -> { method: "POST",   path: "/api/users" }
getUpdateUserRoute(id) -> { method: "PUT",    path: `/api/users/${id}` }
getDeleteUserRoute(id) -> { method: "DELETE", path: `/api/users/${id}` }
```

Fix handler status codes:
- `handleCreateUser`: return `status: 201`
- `handleDeleteUser`: return `status: 204` with `body: {}`
- All "not found" cases: return `status: 404`
