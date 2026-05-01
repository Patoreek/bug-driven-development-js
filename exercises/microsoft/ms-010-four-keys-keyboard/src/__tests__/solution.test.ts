import { describe, it, expect } from "vitest";
import { maxA } from "../solution";

describe("Four Keys Keyboard", () => {
  describe("base cases (n <= 6)", () => {
    it("should return 1 for n=1", () => {
      expect(maxA(1)).toBe(1);
    });

    it("should return 3 for n=3", () => {
      expect(maxA(3)).toBe(3);
    });

    it("should return 4 for n=4", () => {
      expect(maxA(4)).toBe(4);
    });

    it("should return 5 for n=5", () => {
      expect(maxA(5)).toBe(5);
    });

    it("should return 6 for n=6", () => {
      expect(maxA(6)).toBe(6);
    });
  });

  describe("cases where multiple pastes matter (n >= 7)", () => {
    it("should return 9 for n=7", () => {
      // A,A,A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V = 3*3 = 9
      expect(maxA(7)).toBe(9);
    });

    it("should return 12 for n=8", () => {
      // A,A,A,A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V = 4*3 = 12
      expect(maxA(8)).toBe(12);
    });

    it("should return 16 for n=9", () => {
      expect(maxA(9)).toBe(16);
    });

    it("should return 20 for n=10", () => {
      expect(maxA(10)).toBe(20);
    });

    it("should return 27 for n=11", () => {
      // 3 * 3 * 3 = 27
      expect(maxA(11)).toBe(27);
    });
  });

  describe("larger inputs", () => {
    it("should return 81 for n=15", () => {
      expect(maxA(15)).toBe(81);
    });

    it("should return 324 for n=20", () => {
      expect(maxA(20)).toBe(324);
    });
  });

  describe("the bug: single paste vs multiple pastes", () => {
    it("should handle triple paste (multiply by 3) correctly", () => {
      // n=7: A,A,A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V
      // = 3 * (7-3-1) = 3 * 3 = 9, not 3 * 2 = 6
      // Buggy version gets dp[4]*2 = 8, correct is 9
      expect(maxA(7)).toBe(9);
    });

    it("should handle quadruple paste correctly", () => {
      // n=9: A,A,A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V, Ctrl-V, Ctrl-V
      // or A,A,A,A,A, Ctrl-A, Ctrl-C, Ctrl-V, Ctrl-V
      // dp[3]*4=12 vs dp[5]*3=15 vs dp[4]*3=12 ...
      // Actually 9→16: dp[4]*3=12 or dp[3]*4=12 or other combos
      // Best: dp[4]*4=16 (4 A's then Ctrl-A,Ctrl-C, paste 3 times = 4*4 nope)
      // Actually n=9: dp[5]*3=15 or dp[4]*4=16 → dp[4]=4, (9-4-1)=4, 4*4=16
      expect(maxA(9)).toBe(16);
    });

    it("should produce results that grow faster than doubling", () => {
      // If only doubling, n=15 would give much less than 81
      // Doubling approach: dp[12]*2 = dp[9]*2*2 = dp[6]*2*2*2 = 6*8 = 48
      // Correct: 81 (3^4)
      expect(maxA(15)).toBeGreaterThan(48);
    });
  });
});
