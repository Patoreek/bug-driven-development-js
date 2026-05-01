import { describe, it, expect } from "vitest";
import { reverseWords } from "../solution";

describe("reverseWords", () => {
  it("should reverse two words", () => {
    const s = ["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"];
    reverseWords(s);
    expect(s).toEqual(["w", "o", "r", "l", "d", " ", "h", "e", "l", "l", "o"]);
  });

  it("should handle a single word (no change)", () => {
    const s = ["h", "e", "l", "l", "o"];
    reverseWords(s);
    expect(s).toEqual(["h", "e", "l", "l", "o"]);
  });

  it("should reverse three words", () => {
    const s = ["t", "h", "e", " ", "s", "k", "y", " ", "i", "s", " ", "b", "l", "u", "e"];
    reverseWords(s);
    expect(s).toEqual(["b", "l", "u", "e", " ", "i", "s", " ", "s", "k", "y", " ", "t", "h", "e"]);
  });

  it("should handle single character words", () => {
    const s = ["a", " ", "b", " ", "c"];
    reverseWords(s);
    expect(s).toEqual(["c", " ", "b", " ", "a"]);
  });

  it("should handle a single character", () => {
    const s = ["x"];
    reverseWords(s);
    expect(s).toEqual(["x"]);
  });

  it("should handle two single-character words", () => {
    const s = ["a", " ", "b"];
    reverseWords(s);
    expect(s).toEqual(["b", " ", "a"]);
  });

  it("should modify the array in-place", () => {
    const s = ["h", "i", " ", "y", "o"];
    const ref = s; // same reference
    reverseWords(s);
    expect(s).toBe(ref); // must be the same array object
    expect(s).toEqual(["y", "o", " ", "h", "i"]);
  });

  it("should handle words of different lengths", () => {
    const s = ["I", " ", "l", "o", "v", "e", " ", "c", "o", "d", "i", "n", "g"];
    reverseWords(s);
    expect(s).toEqual(["c", "o", "d", "i", "n", "g", " ", "l", "o", "v", "e", " ", "I"]);
  });
});
