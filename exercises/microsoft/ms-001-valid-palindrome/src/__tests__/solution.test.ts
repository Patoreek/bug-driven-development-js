import { describe, it, expect } from "vitest";
import { isPalindrome } from "../solution";

describe("isPalindrome", () => {
  it("should return true for a classic palindrome with spaces and punctuation", () => {
    expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true);
  });

  it("should return false for a non-palindrome", () => {
    expect(isPalindrome("race a car")).toBe(false);
  });

  it("should return true for an empty string", () => {
    expect(isPalindrome("")).toBe(true);
  });

  it("should return true for a string with only non-alphanumeric characters", () => {
    expect(isPalindrome(" ")).toBe(true);
    expect(isPalindrome(",.!@#")).toBe(true);
  });

  it("should return true for a single character", () => {
    expect(isPalindrome("a")).toBe(true);
  });

  it("should handle case insensitivity", () => {
    expect(isPalindrome("Aa")).toBe(true);
    expect(isPalindrome("AbBa")).toBe(true);
  });

  it("should return false for '0P'", () => {
    expect(isPalindrome("0P")).toBe(false);
  });

  it("should handle numeric palindromes", () => {
    expect(isPalindrome("12321")).toBe(true);
    expect(isPalindrome("12345")).toBe(false);
  });

  it("should handle mixed alphanumeric with special characters", () => {
    expect(isPalindrome("Was it a car or a cat I saw?")).toBe(true);
  });

  it("should handle palindrome with only punctuation between chars", () => {
    expect(isPalindrome("a.b,.b" + ",,a")).toBe(true);
  });
});
