import { describe, it, expect } from "vitest";
import { AutocompleteSystem } from "../solution";

describe("Design Search Autocomplete System", () => {
  describe("basic LeetCode example", () => {
    it('should return correct results for "i"', () => {
      const system = new AutocompleteSystem(
        ["i love you", "island", "iroman", "i love leetcode"],
        [5, 3, 2, 2]
      );
      expect(system.input("i")).toEqual([
        "i love you",
        "island",
        "i love leetcode",
      ]);
    });

    it('should return correct results for "i" then " "', () => {
      const system = new AutocompleteSystem(
        ["i love you", "island", "iroman", "i love leetcode"],
        [5, 3, 2, 2]
      );
      system.input("i");
      expect(system.input(" ")).toEqual([
        "i love you",
        "i love leetcode",
      ]);
    });

    it('should return empty for "i", " ", "a"', () => {
      const system = new AutocompleteSystem(
        ["i love you", "island", "iroman", "i love leetcode"],
        [5, 3, 2, 2]
      );
      system.input("i");
      system.input(" ");
      expect(system.input("a")).toEqual([]);
    });

    it('should return empty for "#" and record the sentence', () => {
      const system = new AutocompleteSystem(
        ["i love you", "island", "iroman", "i love leetcode"],
        [5, 3, 2, 2]
      );
      system.input("i");
      system.input(" ");
      system.input("a");
      expect(system.input("#")).toEqual([]);
    });
  });

  describe("empty input history", () => {
    it("should return empty results when no sentences match", () => {
      const system = new AutocompleteSystem([], []);
      expect(system.input("a")).toEqual([]);
    });
  });

  describe("adding new sentences via #", () => {
    it("should record new sentences and include them in future searches", () => {
      const system = new AutocompleteSystem(["abc"], [3]);

      // Type "ab" then "#" to record "ab"
      system.input("a");
      system.input("b");
      system.input("#");

      // Now search again - "ab" should appear as a result
      const results = system.input("a");
      expect(results).toContain("abc");
      expect(results).toContain("ab");
    });
  });

  describe("frequency tiebreaking (alphabetical)", () => {
    it("should sort alphabetically when frequencies are equal", () => {
      const system = new AutocompleteSystem(
        ["banana", "bandana", "band"],
        [1, 1, 1]
      );
      expect(system.input("b")).toEqual(["banana", "band", "bandana"]);
    });

    it("should prefer higher frequency over alphabetical order", () => {
      const system = new AutocompleteSystem(
        ["banana", "bandana", "band"],
        [1, 3, 2]
      );
      expect(system.input("b")).toEqual(["bandana", "band", "banana"]);
    });
  });

  describe("no matches for prefix", () => {
    it("should return empty when no sentences have the prefix", () => {
      const system = new AutocompleteSystem(["apple", "banana"], [5, 3]);
      expect(system.input("c")).toEqual([]);
    });

    it("should return empty for continued typing after no match", () => {
      const system = new AutocompleteSystem(["apple"], [5]);
      system.input("b"); // no match
      expect(system.input("a")).toEqual([]); // still no match for "ba"
    });
  });

  describe("same sentence entered multiple times", () => {
    it("should increase frequency when same sentence is entered again", () => {
      const system = new AutocompleteSystem(
        ["hello world", "hello there"],
        [2, 5]
      );

      // "hello there" has freq 5, "hello world" has freq 2
      // Type full sentence to check, then terminate with #
      "hello world".split("").forEach((c) => system.input(c));
      system.input("#"); // Records "hello world", now freq = 3

      // Verify "hello there" still leads (freq 5 vs 3)
      // We need to start a fresh input sequence
      "hello there".split("").forEach((c) => system.input(c));
      system.input("#"); // Records "hello there", now freq = 6

      // Enter "hello world" 4 more times to overtake "hello there"
      for (let i = 0; i < 4; i++) {
        "hello world".split("").forEach((c) => system.input(c));
        system.input("#");
      }

      // Now "hello world" has freq 7, "hello there" has freq 6
      const results = system.input("h");
      expect(results[0]).toBe("hello world");
      expect(results[1]).toBe("hello there");
      system.input("#"); // Reset
    });
  });

  describe("returns at most 3 results", () => {
    it("should return only top 3 even when more matches exist", () => {
      const system = new AutocompleteSystem(
        ["a1", "a2", "a3", "a4", "a5"],
        [5, 4, 3, 2, 1]
      );
      const results = system.input("a");
      expect(results).toHaveLength(3);
      expect(results).toEqual(["a1", "a2", "a3"]);
    });
  });

  describe("performance (Trie vs brute force)", () => {
    it("should handle large input efficiently", () => {
      const sentences: string[] = [];
      const times: number[] = [];

      // Generate 10000 sentences
      for (let i = 0; i < 10000; i++) {
        sentences.push(`sentence number ${i} with some padding text`);
        times.push(Math.floor(Math.random() * 100));
      }

      const system = new AutocompleteSystem(sentences, times);

      // Time 1000 input operations
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        system.input("s");
        system.input("e");
        system.input("n");
        system.input("t");
        system.input("e");
        system.input("n");
        system.input("c");
        system.input("e");
        system.input(" ");
        system.input("#");
      }
      const elapsed = performance.now() - start;

      // Should complete in reasonable time (< 5 seconds)
      // The brute force approach would be much slower at scale
      expect(elapsed).toBeLessThan(5000);
    });
  });
});
