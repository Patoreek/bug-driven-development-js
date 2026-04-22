import { getUsers, getUserById } from "../api";

const SENSITIVE_FIELDS = [
  "passwordHash",
  "salary",
  "internalNotes",
  "sessionToken",
  "email",
];

const ALLOWED_FIELDS = ["id", "name", "avatarUrl", "role"];

describe("API overfetching prevention", () => {
  it("getUsers returns an array of users", () => {
    const result = getUsers();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("each user has required public fields", () => {
    const result = getUsers();
    for (const user of result) {
      for (const field of ALLOWED_FIELDS) {
        expect(user).toHaveProperty(field);
      }
    }
  });

  it("getUsers does NOT include passwordHash", () => {
    const result = getUsers();
    for (const user of result) {
      expect(user).not.toHaveProperty("passwordHash");
    }
  });

  it("getUsers does NOT include salary", () => {
    const result = getUsers();
    for (const user of result) {
      expect(user).not.toHaveProperty("salary");
    }
  });

  it("getUsers does NOT include internalNotes", () => {
    const result = getUsers();
    for (const user of result) {
      expect(user).not.toHaveProperty("internalNotes");
    }
  });

  it("getUsers does NOT include sessionToken", () => {
    const result = getUsers();
    for (const user of result) {
      expect(user).not.toHaveProperty("sessionToken");
    }
  });

  it("getUsers does NOT include email", () => {
    const result = getUsers();
    for (const user of result) {
      expect(user).not.toHaveProperty("email");
    }
  });

  it("getUserById returns only public fields for a valid id", () => {
    const result = getUserById("u1");
    expect(result).toBeDefined();
    expect(result!.name).toBe("Alice Chen");

    for (const field of SENSITIVE_FIELDS) {
      expect(result).not.toHaveProperty(field);
    }

    for (const field of ALLOWED_FIELDS) {
      expect(result).toHaveProperty(field);
    }
  });

  it("getUserById returns undefined for invalid id", () => {
    const result = getUserById("non-existent");
    expect(result).toBeUndefined();
  });

  it("returned objects have ONLY the allowed fields (no extra)", () => {
    const result = getUsers();
    for (const user of result) {
      const keys = Object.keys(user);
      expect(keys.sort()).toEqual([...ALLOWED_FIELDS].sort());
    }
  });
});
