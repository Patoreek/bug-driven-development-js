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
 */
export function getListUsersRoute(): Route {
  return { method: "GET", path: "/api/users" };
}

/**
 * Returns the route definition for getting a single user.
 */
export function getGetUserRoute(id: string): Route {
  return { method: "GET", path: `/api/users/${id}` };
}

/**
 * Returns the route definition for creating a user.
 */
export function getCreateUserRoute(): Route {
  return { method: "POST", path: "/api/users" };
}

/**
 * Returns the route definition for updating a user.
 */
export function getUpdateUserRoute(id: string): Route {
  return { method: "PUT", path: `/api/users/${id}` };
}

/**
 * Returns the route definition for deleting a user.
 */
export function getDeleteUserRoute(id: string): Route {
  return { method: "DELETE", path: `/api/users/${id}` };
}

/**
 * Handles listing all users.
 */
export function handleListUsers(): RouteResponse {
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
    return { status: 404, body: { error: "User not found" } };
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
  return { status: 201, body: { data: user } };
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
    return { status: 404, body: { error: "User not found" } };
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
    return { status: 404, body: { error: "User not found" } };
  }
  users.delete(id);
  return { status: 204, body: {} };
}
