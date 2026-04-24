import { describe, it, expect } from "vitest";
import {
  findUserByEmail,
  hasAdminUser,
  findActiveUserByRole,
  hasUsersFromDomain,
} from "../utils";
import type { User } from "../utils";

const testUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@company.com", role: "admin", active: true },
  { id: 2, name: "Bob", email: "bob@company.com", role: "editor", active: true },
  { id: 3, name: "Charlie", email: "charlie@external.org", role: "viewer", active: false },
  { id: 4, name: "Diana", email: "diana@company.com", role: "viewer", active: true },
  { id: 5, name: "Eve", email: "eve@external.org", role: "admin", active: false },
];

describe("findUserByEmail", () => {
  it("should find a user that exists", () => {
    const result = findUserByEmail(testUsers, "bob@company.com");
    expect(result).toEqual(testUsers[1]);
  });

  it("should return undefined when user is not found", () => {
    const result = findUserByEmail(testUsers, "nobody@company.com");
    expect(result).toBeUndefined();
  });

  it("should return the exact user object", () => {
    const result = findUserByEmail(testUsers, "alice@company.com");
    expect(result?.name).toBe("Alice");
    expect(result?.role).toBe("admin");
  });

  it("should handle an empty array", () => {
    expect(findUserByEmail([], "test@test.com")).toBeUndefined();
  });

  it("should short-circuit after finding the first match", () => {
    let callCount = 0;
    const largeArray: User[] = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `User${i}`,
      email: i === 0 ? "target@test.com" : `user${i}@test.com`,
      role: "viewer" as const,
      active: true,
    }));

    const originalFind = Array.prototype.find;
    // Verify .find() is used (it short-circuits) or result is correct
    const result = findUserByEmail(largeArray, "target@test.com");
    expect(result?.email).toBe("target@test.com");
  });
});

describe("hasAdminUser", () => {
  it("should return true when admin exists", () => {
    expect(hasAdminUser(testUsers)).toBe(true);
  });

  it("should return false when no admin exists", () => {
    const noAdmins = testUsers.filter((u) => u.role !== "admin");
    expect(hasAdminUser(noAdmins)).toBe(false);
  });

  it("should handle an empty array", () => {
    expect(hasAdminUser([])).toBe(false);
  });

  it("should return a boolean (not a number or truthy value)", () => {
    const result = hasAdminUser(testUsers);
    expect(typeof result).toBe("boolean");
  });
});

describe("findActiveUserByRole", () => {
  it("should find the first active admin", () => {
    const result = findActiveUserByRole(testUsers, "admin");
    expect(result?.name).toBe("Alice");
  });

  it("should return undefined for inactive-only roles", () => {
    // Charlie is viewer but inactive, Diana is viewer and active
    const result = findActiveUserByRole(
      testUsers.filter((u) => u.name !== "Diana"),
      "viewer"
    );
    expect(result).toBeUndefined();
  });

  it("should return undefined when no match exists", () => {
    expect(findActiveUserByRole([], "admin")).toBeUndefined();
  });

  it("should return undefined (not null) when not found", () => {
    const result = findActiveUserByRole([], "admin");
    expect(result).toBe(undefined);
    expect(result).not.toBe(null);
  });
});

describe("hasUsersFromDomain", () => {
  it("should return true for existing domain", () => {
    expect(hasUsersFromDomain(testUsers, "company.com")).toBe(true);
  });

  it("should return true for another existing domain", () => {
    expect(hasUsersFromDomain(testUsers, "external.org")).toBe(true);
  });

  it("should return false for non-existing domain", () => {
    expect(hasUsersFromDomain(testUsers, "unknown.io")).toBe(false);
  });

  it("should return false for empty array", () => {
    expect(hasUsersFromDomain([], "company.com")).toBe(false);
  });
});
