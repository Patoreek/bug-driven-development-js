import { describe, it, expect } from "vitest";
import { getValidScores, getDisplayNames, getFeatureFlags } from "../utils";

describe("getValidScores", () => {
  it("should remove null and undefined values", () => {
    const scores = [85, null, 92, undefined, 78];
    expect(getValidScores(scores)).toEqual([85, 92, 78]);
  });

  it("should keep 0 as a valid score", () => {
    const scores = [100, 0, null, 50, undefined, 0];
    const result = getValidScores(scores);
    expect(result).toEqual([100, 0, 50, 0]);
  });

  it("should return an empty array when all values are null/undefined", () => {
    expect(getValidScores([null, undefined, null])).toEqual([]);
  });

  it("should return the same array content when there are no null/undefined", () => {
    expect(getValidScores([1, 2, 3, 0])).toEqual([1, 2, 3, 0]);
  });

  it("should handle an empty array", () => {
    expect(getValidScores([])).toEqual([]);
  });
});

describe("getDisplayNames", () => {
  it("should remove null and undefined values", () => {
    const names = ["Alice", null, "Bob", undefined];
    expect(getDisplayNames(names)).toEqual(["Alice", "Bob"]);
  });

  it('should keep empty string "" as a valid display name', () => {
    const names = ["Alice", "", null, "Bob", undefined, ""];
    const result = getDisplayNames(names);
    expect(result).toEqual(["Alice", "", "Bob", ""]);
  });

  it("should handle all null/undefined", () => {
    expect(getDisplayNames([null, undefined])).toEqual([]);
  });
});

describe("getFeatureFlags", () => {
  it("should remove null and undefined values", () => {
    const flags = [true, null, false, undefined];
    expect(getFeatureFlags(flags)).toEqual([true, false]);
  });

  it("should keep false as a valid flag value", () => {
    const flags = [true, false, null, false, undefined, true];
    const result = getFeatureFlags(flags);
    expect(result).toEqual([true, false, false, true]);
  });

  it("should handle all null/undefined", () => {
    expect(getFeatureFlags([null, undefined])).toEqual([]);
  });
});
