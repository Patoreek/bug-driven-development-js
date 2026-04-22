import { describe, it, expect } from "vitest";
import {
  findUserByName,
  findUsersByRole,
  searchUsers,
  insertUser,
  updateUserEmail,
} from "../query-builder";

describe("findUserByName", () => {
  it("should use parameterized query for the name", () => {
    const query = findUserByName("Alice");

    expect(query.text).not.toContain("Alice");
    expect(query.text).toContain("$1");
    expect(query.params).toEqual(["Alice"]);
  });

  it("should not be vulnerable to SQL injection", () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const query = findUserByName(maliciousInput);

    expect(query.text).not.toContain("DROP TABLE");
    expect(query.text).not.toContain(maliciousInput);
    expect(query.params).toContain(maliciousInput);
  });
});

describe("findUsersByRole", () => {
  it("should use parameterized query for role and limit", () => {
    const query = findUsersByRole("admin", 10);

    expect(query.text).not.toContain("'admin'");
    expect(query.text).toContain("$1");
    expect(query.text).toContain("$2");
    expect(query.params).toEqual(["admin", 10]);
  });

  it("should not be vulnerable to SQL injection via role", () => {
    const maliciousRole = "admin' OR '1'='1";
    const query = findUsersByRole(maliciousRole, 10);

    expect(query.text).not.toContain(maliciousRole);
    expect(query.params[0]).toBe(maliciousRole);
  });
});

describe("searchUsers", () => {
  it("should use parameterized query for all parameters", () => {
    const query = searchUsers("john", 18, 65);

    expect(query.text).toContain("$1");
    expect(query.text).toContain("$2");
    expect(query.text).toContain("$3");
    expect(query.text).not.toContain("'%john%'");
    expect(query.params).toHaveLength(3);
  });

  it("should put LIKE wildcards in the params, not the query text", () => {
    const query = searchUsers("test", 20, 30);

    // The LIKE pattern with wildcards should be in params, not in the SQL text
    expect(query.params[0]).toContain("%");
    expect(query.text).not.toContain("%test%");
  });

  it("should not be vulnerable to SQL injection via namePattern", () => {
    const maliciousPattern = "'; DELETE FROM users WHERE '1'='1";
    const query = searchUsers(maliciousPattern, 18, 65);

    expect(query.text).not.toContain("DELETE FROM");
    expect(query.text).not.toContain(maliciousPattern);
  });
});

describe("insertUser", () => {
  it("should use parameterized query for all values", () => {
    const query = insertUser("Bob", "bob@example.com", "user");

    expect(query.text).toContain("$1");
    expect(query.text).toContain("$2");
    expect(query.text).toContain("$3");
    expect(query.text).not.toContain("Bob");
    expect(query.text).not.toContain("bob@example.com");
    expect(query.params).toEqual(["Bob", "bob@example.com", "user"]);
  });

  it("should not be vulnerable to SQL injection via email", () => {
    const maliciousEmail = "bob@test.com', 'admin'); DROP TABLE users; --";
    const query = insertUser("Bob", maliciousEmail, "user");

    expect(query.text).not.toContain("DROP TABLE");
    expect(query.params[1]).toBe(maliciousEmail);
  });
});

describe("updateUserEmail", () => {
  it("should use parameterized query for both values", () => {
    const query = updateUserEmail("user-123", "newemail@test.com");

    expect(query.text).toContain("$1");
    expect(query.text).toContain("$2");
    expect(query.text).not.toContain("newemail@test.com");
    expect(query.text).not.toContain("user-123");
    expect(query.params).toEqual(["newemail@test.com", "user-123"]);
  });

  it("should not be vulnerable to SQL injection via userId", () => {
    const maliciousId = "1' OR '1'='1";
    const query = updateUserEmail(maliciousId, "email@test.com");

    expect(query.text).not.toContain(maliciousId);
  });
});
