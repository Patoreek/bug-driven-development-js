import { describe, it, expect } from "vitest";
import { isValid } from "../solution";

describe("isValid", () => {
  it('should return true for simple valid "()"', () => {
    expect(isValid("()")).toBe(true);
  });

  it('should return true for multiple types "()\[\]{}"', () => {
    expect(isValid("()[]{}")).toBe(true);
  });

  it('should return true for nested "([{}])"', () => {
    expect(isValid("([{}])")).toBe(true);
  });

  it('should return true for complex nesting "{[()()]}"', () => {
    expect(isValid("{[()()]}")).toBe(true);
  });

  it('should return false for mismatched types "(]"', () => {
    expect(isValid("(]")).toBe(false);
  });

  it('should return false for interleaved "([)]"', () => {
    // This is the KEY test: equal counts but wrong ordering
    expect(isValid("([)]")).toBe(false);
  });

  it('should return false for unmatched opening "("', () => {
    expect(isValid("(")).toBe(false);
  });

  it('should return false for unmatched closing ")"', () => {
    expect(isValid(")")).toBe(false);
  });

  it('should return false for only closing "]"', () => {
    expect(isValid("]")).toBe(false);
  });

  it("should return true for empty string", () => {
    expect(isValid("")).toBe(true);
  });

  it('should return false for wrong order ")("', () => {
    // Equal counts but closing comes before opening
    expect(isValid(")(")).toBe(false);
  });

  it("should return false for mixed invalid types", () => {
    expect(isValid("{(})")).toBe(false);
  });

  it("should handle long valid strings", () => {
    const s = "([{}])".repeat(1000);
    expect(isValid(s)).toBe(true);
  });

  it("should handle long invalid strings (one mismatch at end)", () => {
    const s = "(" + "()".repeat(999) + "]";
    expect(isValid(s)).toBe(false);
  });
});
