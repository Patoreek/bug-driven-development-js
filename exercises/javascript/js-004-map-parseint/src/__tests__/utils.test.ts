import { describe, it, expect } from "vitest";
import { parseScores, parseFloats, parsePixelValues } from "../utils";

describe("parseScores", () => {
  it("should parse simple string numbers to integers", () => {
    expect(parseScores(["1", "2", "3"])).toEqual([1, 2, 3]);
  });

  it("should parse multi-digit strings correctly", () => {
    expect(parseScores(["10", "11", "12", "100"])).toEqual([10, 11, 12, 100]);
  });

  it("should parse a longer array without NaN values", () => {
    const input = ["1", "2", "3", "10", "11", "20", "100"];
    const result = parseScores(input);
    expect(result).toEqual([1, 2, 3, 10, 11, 20, 100]);
    expect(result.every((n) => !isNaN(n))).toBe(true);
  });

  it("should handle single element arrays", () => {
    expect(parseScores(["42"])).toEqual([42]);
  });

  it("should handle empty arrays", () => {
    expect(parseScores([])).toEqual([]);
  });

  it("should not produce any NaN values for valid numeric strings", () => {
    const input = ["5", "15", "25", "35", "45"];
    const result = parseScores(input);
    expect(result).not.toContain(NaN);
    expect(result).toEqual([5, 15, 25, 35, 45]);
  });
});

describe("parseFloats", () => {
  it("should parse decimal strings correctly", () => {
    expect(parseFloats(["3.14", "2.71", "1.41"])).toEqual([3.14, 2.71, 1.41]);
  });

  it("should parse integer strings as floats", () => {
    expect(parseFloats(["1", "2", "3"])).toEqual([1, 2, 3]);
  });

  it("should handle mixed integer and decimal strings", () => {
    expect(parseFloats(["10", "3.5", "7"])).toEqual([10, 3.5, 7]);
  });
});

describe("parsePixelValues", () => {
  it("should extract numbers from pixel strings", () => {
    expect(parsePixelValues(["16px", "24px", "8px"])).toEqual([16, 24, 8]);
  });

  it("should handle larger pixel values", () => {
    expect(parsePixelValues(["100px", "200px", "50px"])).toEqual([
      100, 200, 50,
    ]);
  });

  it("should not produce NaN for valid pixel strings", () => {
    const result = parsePixelValues(["12px", "24px", "36px", "48px"]);
    expect(result).not.toContain(NaN);
    expect(result).toEqual([12, 24, 36, 48]);
  });
});
