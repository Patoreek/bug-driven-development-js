import { describe, it, expect } from "vitest";
import { parseUserResponse, parseUserList, getConfigValue } from "../parseApiResponse";

describe("parseUserResponse", () => {
  it("should parse a valid API response", () => {
    const raw = {
      data: { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
      meta: { total: 1, page: 1 },
    };

    const result = parseUserResponse(raw);
    expect(result.data.name).toBe("Alice");
    expect(result.data.role).toBe("admin");
    expect(result.meta.total).toBe(1);
  });

  it("should throw when input is null", () => {
    expect(() => parseUserResponse(null)).toThrow();
  });

  it("should throw when input is undefined", () => {
    expect(() => parseUserResponse(undefined)).toThrow();
  });

  it("should throw when data field is missing", () => {
    expect(() => parseUserResponse({ meta: { total: 1, page: 1 } })).toThrow();
  });

  it("should throw when role is invalid", () => {
    const raw = {
      data: { id: 1, name: "Alice", email: "alice@example.com", role: "superuser" },
      meta: { total: 1, page: 1 },
    };

    expect(() => parseUserResponse(raw)).toThrow();
  });

  it("should throw when id is not a number", () => {
    const raw = {
      data: { id: "abc", name: "Alice", email: "alice@example.com", role: "admin" },
      meta: { total: 1, page: 1 },
    };

    expect(() => parseUserResponse(raw)).toThrow();
  });

  it("should throw when email is missing", () => {
    const raw = {
      data: { id: 1, name: "Alice", role: "admin" },
      meta: { total: 1, page: 1 },
    };

    expect(() => parseUserResponse(raw)).toThrow();
  });
});

describe("parseUserList", () => {
  it("should parse a valid user list", () => {
    const raw = {
      users: [
        { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "viewer" },
      ],
    };

    const result = parseUserList(raw);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Alice");
    expect(result[1].role).toBe("viewer");
  });

  it("should throw when input is null", () => {
    expect(() => parseUserList(null)).toThrow();
  });

  it("should throw when users is not an array", () => {
    expect(() => parseUserList({ users: "not-an-array" })).toThrow();
  });

  it("should throw when a user in the list has an invalid role", () => {
    const raw = {
      users: [
        { id: 1, name: "Alice", email: "alice@example.com", role: "hacker" },
      ],
    };

    expect(() => parseUserList(raw)).toThrow();
  });

  it("should return an empty array for empty users list", () => {
    const result = parseUserList({ users: [] });
    expect(result).toEqual([]);
  });
});

describe("getConfigValue", () => {
  it("should return value for valid key", () => {
    const config = { theme: "dark", lang: "en" };
    expect(getConfigValue(config, "theme")).toBe("dark");
  });

  it("should throw when config is null", () => {
    expect(() => getConfigValue(null, "key")).toThrow();
  });

  it("should throw when key does not exist", () => {
    expect(() => getConfigValue({ theme: "dark" }, "missing")).toThrow();
  });

  it("should throw when value is not a string", () => {
    expect(() => getConfigValue({ count: 42 }, "count")).toThrow();
  });
});
