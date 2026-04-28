import { describe, it, expect } from "vitest";
import { coinChange } from "../solution";

describe("coinChange", () => {
  it("should return 2 for coins=[1,5,10] amount=11 → 10+1", () => {
    expect(coinChange([1, 5, 10], 11)).toBe(2);
  });

  it("should return -1 when amount is impossible", () => {
    expect(coinChange([2], 3)).toBe(-1);
  });

  it("should return 0 for amount=0", () => {
    expect(coinChange([1], 0)).toBe(0);
  });

  it("should return 2 for greedy-breaking case coins=[1,3,4] amount=6", () => {
    // Greedy: 4 + 1 + 1 = 3 coins
    // Optimal: 3 + 3 = 2 coins
    expect(coinChange([1, 3, 4], 6)).toBe(2);
  });

  it("should return 1 when amount equals a single coin", () => {
    expect(coinChange([1, 5, 10], 10)).toBe(1);
  });

  it("should handle single coin denomination", () => {
    expect(coinChange([3], 9)).toBe(3);
  });

  it("should return -1 for single coin that doesn't divide amount", () => {
    expect(coinChange([3], 7)).toBe(-1);
  });

  it("should handle coins=[1,2,5] amount=11 → 5+5+1=3", () => {
    expect(coinChange([1, 2, 5], 11)).toBe(3);
  });

  it("should handle large coin set", () => {
    expect(coinChange([1, 5, 10, 25], 30)).toBe(2); // 25 + 5
  });

  it("should handle another greedy-breaking case coins=[1,5,6,9] amount=11", () => {
    // Greedy: 9 + 1 + 1 = 3 coins
    // Optimal: 5 + 6 = 2 coins
    expect(coinChange([1, 5, 6, 9], 11)).toBe(2);
  });

  it("should handle amount=1 with coin=1", () => {
    expect(coinChange([1], 1)).toBe(1);
  });

  it("should handle coins not including 1", () => {
    expect(coinChange([3, 5], 8)).toBe(2); // 3 + 5
  });

  it("should return -1 when no coins can make amount (coins not including 1)", () => {
    expect(coinChange([3, 5], 4)).toBe(-1);
  });
});
