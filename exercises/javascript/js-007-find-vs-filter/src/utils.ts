export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
}

/**
 * Finds a single user by their email address.
 * Returns the user if found, or undefined if not.
 */
export function findUserByEmail(
  users: User[],
  email: string
): User | undefined {
  return users.filter((u) => u.email === email)[0] ?? null;
}

/**
 * Checks whether any admin user exists in the array.
 * Returns true if at least one admin exists, false otherwise.
 */
export function hasAdminUser(users: User[]): boolean {
  return users.filter((u) => u.role === "admin").length > 0;
}

/**
 * Finds the first active user with a given role.
 * Returns the user if found, or undefined if not.
 */
export function findActiveUserByRole(
  users: User[],
  role: User["role"]
): User | undefined {
  return users.filter((u) => u.role === role && u.active)[0] ?? null;
}

/**
 * Checks if any user in the array has a specific email domain.
 * e.g., hasUsersFromDomain(users, "company.com") checks for @company.com emails
 */
export function hasUsersFromDomain(
  users: User[],
  domain: string
): boolean {
  return users.filter((u) => u.email.endsWith(`@${domain}`)).length > 0;
}
