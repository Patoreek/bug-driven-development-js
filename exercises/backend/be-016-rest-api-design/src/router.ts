export interface Route {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
}

export interface RouteResponse {
  status: number;
  body: Record<string, unknown>;
}

// Simulated database
const users = new Map<string, { id: string; name: string; email: string }>([
  ["1", { id: "1", name: "Alice", email: "alice@example.com" }],
  ["2", { id: "2", name: "Bob", email: "bob@example.com" }],
]);

/**
 * Returns the route definition for listing all users.
 *
 * BUG: Uses POST method and verb-based URL.
 */
export function getListUsersRoute(): Route {
  // BUG: Should be GET, and URL should be /api/users (no verb)
  return { method: "POST", path: "/api/getUsers" };
}

/**
 * Returns the route definition for getting a single user.
 *
 * BUG: Uses POST method and verb-based URL.
 */
export function getGetUserRoute(id: string): Route {
  // BUG: Should be GET, and URL should be /api/users/:id
  return { method: "POST", path: `/api/fetchUser/${id}` };
}

/**
 * Returns the route definition for creating a user.
 *
 * BUG: Uses GET method and verb-based URL.
 */
export function getCreateUserRoute(): Route {
  // BUG: Should be POST, and URL should be /api/users
  return { method: "GET", path: "/api/createUser" };
}

/**
 * Returns the route definition for updating a user.
 *
 * BUG: Uses POST method and verb-based URL.
 */
export function getUpdateUserRoute(id: string): Route {
  // BUG: Should be PUT, and URL should be /api/users/:id
  return { method: "POST", path: `/api/updateUser/${id}` };
}

/**
 * Returns the route definition for deleting a user.
 *
 * BUG: Uses GET method and verb-based URL.
 */
export function getDeleteUserRoute(id: string): Route {
  // BUG: Should be DELETE, and URL should be /api/users/:id
  return { method: "GET", path: `/api/removeUser/${id}` };
}

/**
 * Handles listing all users.
 */
export function handleListUsers(): RouteResponse {
  // BUG: Returns 200, which is actually correct for listing!
  return {
    status: 200,
    body: { data: Array.from(users.values()) },
  };
}

/**
 * Handles getting a single user.
 */
export function handleGetUser(id: string): RouteResponse {
  const user = users.get(id);
  if (!user) {
    // BUG: Returns 200 for not found
    return { status: 200, body: { error: "User not found" } };
  }
  return { status: 200, body: { data: user } };
}

/**
 * Handles creating a user.
 */
export function handleCreateUser(data: {
  name: string;
  email: string;
}): RouteResponse {
  const id = String(users.size + 1);
  const user = { id, ...data };
  users.set(id, user);
  // BUG: Returns 200 instead of 201 for creation
  return { status: 200, body: { data: user } };
}

/**
 * Handles updating a user.
 */
export function handleUpdateUser(
  id: string,
  data: { name?: string; email?: string }
): RouteResponse {
  const user = users.get(id);
  if (!user) {
    // BUG: Returns 200 for not found
    return { status: 200, body: { error: "User not found" } };
  }
  const updated = { ...user, ...data };
  users.set(id, updated);
  return { status: 200, body: { data: updated } };
}

/**
 * Handles deleting a user.
 */
export function handleDeleteUser(id: string): RouteResponse {
  const user = users.get(id);
  if (!user) {
    // BUG: Returns 200 for not found
    return { status: 200, body: { error: "User not found" } };
  }
  users.delete(id);
  // BUG: Returns 200 with body instead of 204 (No Content)
  return { status: 200, body: { data: { deleted: true } } };
}
