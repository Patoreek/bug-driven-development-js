import { validatePassword } from "../validatePassword";

// FIXED: Use it.each and describe.each with data tables to eliminate duplication
// and make it trivial to add new test cases.

describe("validatePassword", () => {
  describe("valid passwords", () => {
    it.each([
      { password: "MyP@ssw0rd!", desc: "standard strong password" },
      { password: "C0mpl3x!Pass#2025", desc: "very strong password" },
      { password: "Abcd1!xy", desc: "minimum length valid password" },
      { password: "Paass1!xy", desc: "2 repeated chars (allowed)" },
    ])("should accept: $desc ($password)", ({ password }) => {
      const result = validatePassword(password);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("invalid passwords - missing requirements", () => {
    it.each([
      {
        password: "",
        expectedError: "Must be at least 8 characters",
        desc: "empty string",
      },
      {
        password: "a",
        expectedError: "Must be at least 8 characters",
        desc: "1 character",
      },
      {
        password: "Abc1!xy",
        expectedError: "Must be at least 8 characters",
        desc: "7 characters",
      },
      {
        password: "Aa1!" + "x".repeat(126),
        expectedError: "Must be at most 128 characters",
        desc: "over 128 characters",
      },
      {
        password: "myp@ssw0rd!",
        expectedError: "Must contain an uppercase letter",
        desc: "no uppercase",
      },
      {
        password: "MYP@SSW0RD!",
        expectedError: "Must contain a lowercase letter",
        desc: "no lowercase",
      },
      {
        password: "MyP@ssword!",
        expectedError: "Must contain a digit",
        desc: "no digit",
      },
      {
        password: "MyPassw0rd",
        expectedError: "Must contain a special character",
        desc: "no special character",
      },
      {
        password: "Paaass1!",
        expectedError: "Must not contain 3 or more repeated characters",
        desc: "3 repeated letters",
      },
      {
        password: "Pass111!x",
        expectedError: "Must not contain 3 or more repeated characters",
        desc: "3 repeated digits",
      },
      {
        password: "My Pass1!",
        expectedError: "Must not contain whitespace",
        desc: "contains space",
      },
      {
        password: "My\tPass1!",
        expectedError: "Must not contain whitespace",
        desc: "contains tab",
      },
      {
        password: "MyPassword1!",
        expectedError: "Must not contain a common password pattern",
        desc: "contains 'password'",
      },
      {
        password: "Xadmin123!",
        expectedError: "Must not contain a common password pattern",
        desc: "contains 'admin123'",
      },
      {
        password: "Xqwerty123!",
        expectedError: "Must not contain a common password pattern",
        desc: "contains 'qwerty123'",
      },
    ])("should reject ($desc): expects '$expectedError'", ({ password, expectedError }) => {
      const result = validatePassword(password);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expectedError);
    });
  });

  describe("strength ratings", () => {
    it.each([
      { password: "abc", expectedStrength: "weak" as const, desc: "very short" },
      { password: "abcdefgh", expectedStrength: "weak" as const, desc: "lowercase only 8 chars" },
      { password: "Abcdefgh", expectedStrength: "fair" as const, desc: "mixed case 8 chars" },
      { password: "Abcd1!xy", expectedStrength: "strong" as const, desc: "all types 8 chars" },
      { password: "C0mpl3x!Pass#2025", expectedStrength: "very-strong" as const, desc: "long complex" },
    ])("should rate '$desc' ($password) as $expectedStrength", ({ password, expectedStrength }) => {
      const result = validatePassword(password);
      expect(result.strength).toBe(expectedStrength);
    });
  });

  describe("multiple errors", () => {
    it("should report all applicable errors at once", () => {
      const result = validatePassword("ab");
      expect(result.valid).toBe(false);
      // "ab" fails: too short, no uppercase, no digit, no special
      expect(result.errors).toContain("Must be at least 8 characters");
      expect(result.errors).toContain("Must contain an uppercase letter");
      expect(result.errors).toContain("Must contain a digit");
      expect(result.errors).toContain("Must contain a special character");
      expect(result.errors).toHaveLength(4);
    });
  });
});
