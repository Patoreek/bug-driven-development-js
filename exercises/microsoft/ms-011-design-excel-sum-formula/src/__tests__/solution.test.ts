import { describe, it, expect } from "vitest";
import { Excel } from "../solution";

describe("Design Excel Sum Formula", () => {
  describe("basic set and get", () => {
    it("should set and get a cell value", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 2);
      expect(excel.get(1, "A")).toBe(2);
    });

    it("should return 0 for unset cells", () => {
      const excel = new Excel(3, "C");
      expect(excel.get(1, "A")).toBe(0);
    });

    it("should overwrite existing values", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 5);
      excel.set(1, "A", 10);
      expect(excel.get(1, "A")).toBe(10);
    });
  });

  describe("sum of single cells", () => {
    it("should compute sum of individual cell references", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 2);
      excel.set(1, "B", 4);
      const result = excel.sum(1, "C", ["A1", "B1"]);
      expect(result).toBe(6);
      expect(excel.get(1, "C")).toBe(6);
    });
  });

  describe("sum of ranges", () => {
    it("should compute sum of a rectangular range", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 1);
      excel.set(1, "B", 2);
      excel.set(2, "A", 3);
      excel.set(2, "B", 4);
      const result = excel.sum(3, "C", ["A1:B2"]);
      expect(result).toBe(10);
    });
  });

  describe("reactive updates (THE BUG)", () => {
    it("should update sum cell when a referenced cell changes", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 2);
      excel.sum(2, "A", ["A1"]); // A2 = sum(A1) = 2
      expect(excel.get(2, "A")).toBe(2);

      excel.set(1, "A", 10); // Change A1 to 10
      // A2 should now reflect the updated value
      expect(excel.get(2, "A")).toBe(10);
    });

    it("should update sum when changing cells in a range", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 1);
      excel.set(2, "A", 2);
      excel.set(3, "A", 3);
      excel.sum(1, "B", ["A1:A3"]); // B1 = sum(A1:A3) = 6
      expect(excel.get(1, "B")).toBe(6);

      excel.set(2, "A", 20); // Change A2 from 2 to 20
      expect(excel.get(1, "B")).toBe(24); // 1 + 20 + 3 = 24
    });

    it("should handle the LeetCode example", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 2);
      // C3 = sum of A1 and rectangle A1:B2
      // A1=2, A1:B2 = A1(2)+A2(0)+B1(0)+B2(0) = 2
      // Total = 2 + 2 = 4
      const result = excel.sum(3, "C", ["A1", "A1:B2"]);
      expect(result).toBe(4);

      excel.set(2, "A", 5); // Change A2 to 5
      // Now C3 = A1(2) + (A1(2)+A2(5)+B1(0)+B2(0)) = 2 + 7 = 9
      expect(excel.get(3, "C")).toBe(9);
    });
  });

  describe("chained formulas", () => {
    it("should handle formula cells referencing other formula cells", () => {
      const excel = new Excel(5, "C");
      excel.set(1, "A", 3);
      excel.sum(2, "A", ["A1"]); // A2 = sum(A1) = 3
      excel.sum(3, "A", ["A2"]); // A3 = sum(A2) = sum(sum(A1)) = 3

      expect(excel.get(3, "A")).toBe(3);

      excel.set(1, "A", 10); // Change A1
      // A2 should re-evaluate to 10, A3 should re-evaluate to 10
      expect(excel.get(2, "A")).toBe(10);
      expect(excel.get(3, "A")).toBe(10);
    });

    it("should handle deep formula chains", () => {
      const excel = new Excel(5, "C");
      excel.set(1, "A", 1);
      excel.sum(2, "A", ["A1"]); // A2 = A1
      excel.sum(3, "A", ["A2"]); // A3 = A2
      excel.sum(4, "A", ["A3"]); // A4 = A3

      excel.set(1, "A", 100);
      expect(excel.get(4, "A")).toBe(100);
    });
  });

  describe("set clears formula", () => {
    it("should clear formula when set() is called on a formula cell", () => {
      const excel = new Excel(3, "C");
      excel.set(1, "A", 5);
      excel.sum(2, "A", ["A1"]); // A2 = sum(A1) = 5
      expect(excel.get(2, "A")).toBe(5);

      excel.set(2, "A", 99); // Overwrite A2 with a constant
      expect(excel.get(2, "A")).toBe(99);

      excel.set(1, "A", 0); // Changing A1 should NOT affect A2 anymore
      expect(excel.get(2, "A")).toBe(99);
    });
  });

  describe("sum over range including formula cells", () => {
    it("should correctly evaluate ranges that include formula cells", () => {
      const excel = new Excel(5, "C");
      excel.set(1, "A", 2);
      excel.set(2, "A", 3);
      excel.sum(3, "A", ["A1", "A2"]); // A3 = A1 + A2 = 5

      // B1 = sum of A1:A3 which includes formula cell A3
      excel.sum(1, "B", ["A1:A3"]);
      // A1=2, A2=3, A3=5, total=10
      expect(excel.get(1, "B")).toBe(10);

      excel.set(1, "A", 10); // Change A1 to 10
      // A3 re-evaluates to 10+3=13
      // B1 re-evaluates to 10+3+13=26
      expect(excel.get(1, "B")).toBe(26);
    });
  });
});
