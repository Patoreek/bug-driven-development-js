import { validatePassword } from "../validatePassword";

// BUG: This file has 20+ nearly identical tests with copy-pasted setup.
// Each test duplicates the same pattern: call validatePassword, check valid/errors.
// Some tests have subtle copy-paste bugs where the expected values were
// pasted from a different test and never corrected.
// Adding a new test case requires duplicating ~10 lines.

describe("validatePassword", () => {
  // --- Valid passwords ---

  it("should accept a strong password with all requirements", () => {
    const result = validatePassword("MyP@ssw0rd!");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.strength).toBe("strong");
  });

  it("should accept a very strong password", () => {
    const result = validatePassword("C0mpl3x!Pass#2025");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.strength).toBe("very-strong");
  });

  it("should accept minimum length valid password", () => {
    const result = validatePassword("Abcd1!xy");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  // --- Too short ---

  it("should reject password that is too short - 1 char", () => {
    const result = validatePassword("a");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must be at least 8 characters");
  });

  it("should reject password that is too short - 7 chars", () => {
    const result = validatePassword("Abc1!xy");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must be at least 8 characters");
  });

  it("should reject empty password", () => {
    const result = validatePassword("");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must be at least 8 characters");
  });

  // --- Missing character types ---

  it("should reject password without uppercase", () => {
    const result = validatePassword("myp@ssw0rd!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must contain an uppercase letter");
  });

  it("should reject password without lowercase", () => {
    const result = validatePassword("MYP@SSW0RD!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must contain a lowercase letter");
  });

  it("should reject password without digit", () => {
    const result = validatePassword("MyP@ssword!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must contain a digit");
  });

  it("should reject password without special character", () => {
    const result = validatePassword("MyPassw0rd");
    expect(result.valid).toBe(false);
    // BUG: Copy-paste error -- copied from the "no digit" test above
    // Should check for "Must contain a special character" but checks wrong error
    expect(result.errors).toContain("Must contain a digit");
  });

  // --- Repeated characters ---

  it("should reject password with 3 repeated chars - aaa", () => {
    const result = validatePassword("Paaass1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Must not contain 3 or more repeated characters"
    );
  });

  it("should reject password with 3 repeated chars - 111", () => {
    const result = validatePassword("Pass111!x");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Must not contain 3 or more repeated characters"
    );
  });

  it("should accept password with only 2 repeated chars", () => {
    const result = validatePassword("Paass1!xy");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  // --- Whitespace ---

  it("should reject password with space", () => {
    const result = validatePassword("My Pass1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must not contain whitespace");
  });

  it("should reject password with tab", () => {
    const result = validatePassword("My\tPass1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must not contain whitespace");
  });

  // --- Common passwords ---

  it("should reject password containing 'password'", () => {
    const result = validatePassword("MyPassword1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Must not contain a common password pattern"
    );
  });

  it("should reject password containing 'admin123'", () => {
    const result = validatePassword("Xadmin123!");
    expect(result.valid).toBe(false);
    // BUG: Copy-paste error -- checks for "password" pattern message
    // instead of "common password pattern"
    expect(result.errors).toContain("Must not contain a common password pattern");
  });

  it("should reject password containing 'qwerty123'", () => {
    const result = validatePassword("Xqwerty123!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Must not contain a common password pattern"
    );
  });

  // --- Strength levels ---

  it("should rate short invalid password as weak", () => {
    const result = validatePassword("abc");
    expect(result.strength).toBe("weak");
  });

  it("should rate basic valid password as fair", () => {
    // BUG: Copy-paste error -- this password is actually strong, not fair
    // The tester copied a strong password and forgot to adjust the expectation
    const result = validatePassword("Abcd1!xy");
    expect(result.strength).toBe("fair");
  });

  it("should rate long complex password as very-strong", () => {
    const result = validatePassword("C0mpl3x!Pass#2025");
    expect(result.valid).toBe(true);
    expect(result.strength).toBe("very-strong");
  });

  // --- Too long ---

  it("should reject password over 128 characters", () => {
    const longPassword = "Aa1!" + "x".repeat(126);
    const result = validatePassword(longPassword);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Must be at most 128 characters");
  });

  // --- Multiple errors ---

  it("should report multiple errors", () => {
    const result = validatePassword("ab");
    expect(result.valid).toBe(false);
    // BUG: Hardcoded exact error count -- brittle if validation rules change
    // Also wrong: "ab" has 4 errors (too short, no uppercase, no digit, no special)
    expect(result.errors).toHaveLength(3);
  });
});
