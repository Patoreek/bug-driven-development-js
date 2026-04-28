import { describe, it, expect } from "vitest";
import { numIslands } from "../solution";

/** Helper to deep-clone a grid so tests don't share mutable state */
function cloneGrid(grid: string[][]): string[][] {
  return grid.map((row) => [...row]);
}

describe("numIslands", () => {
  it("should return 1 for a single connected island", () => {
    const grid = [
      ["1", "1", "1", "1", "0"],
      ["1", "1", "0", "1", "0"],
      ["1", "1", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(1);
  });

  it("should return 3 for three separate islands", () => {
    const grid = [
      ["1", "1", "0", "0", "0"],
      ["1", "1", "0", "0", "0"],
      ["0", "0", "1", "0", "0"],
      ["0", "0", "0", "1", "1"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(3);
  });

  it("should return 0 for all water", () => {
    const grid = [
      ["0", "0", "0"],
      ["0", "0", "0"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(0);
  });

  it("should return 1 for a single cell of land", () => {
    const grid = [["1"]];
    expect(numIslands(cloneGrid(grid))).toBe(1);
  });

  it("should return 0 for a single cell of water", () => {
    const grid = [["0"]];
    expect(numIslands(cloneGrid(grid))).toBe(0);
  });

  it("should handle an empty grid", () => {
    expect(numIslands([])).toBe(0);
  });

  it("should not count diagonal connections as connected", () => {
    // Two land cells diagonally adjacent are NOT connected
    const grid = [
      ["1", "0"],
      ["0", "1"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(2);
  });

  it("should handle L-shaped island as one island", () => {
    const grid = [
      ["1", "0", "0"],
      ["1", "0", "0"],
      ["1", "1", "1"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(1);
  });

  it("should handle grid full of land as one island", () => {
    const grid = [
      ["1", "1", "1"],
      ["1", "1", "1"],
      ["1", "1", "1"],
    ];
    expect(numIslands(cloneGrid(grid))).toBe(1);
  });

  it("should handle checkerboard pattern", () => {
    const grid = [
      ["1", "0", "1"],
      ["0", "1", "0"],
      ["1", "0", "1"],
    ];
    // Each '1' is isolated — 5 islands
    expect(numIslands(cloneGrid(grid))).toBe(5);
  });

  it("should handle single row", () => {
    const grid = [["1", "0", "1", "1", "0", "1"]];
    expect(numIslands(cloneGrid(grid))).toBe(3);
  });

  it("should handle single column", () => {
    const grid = [["1"], ["0"], ["1"], ["1"], ["0"]];
    expect(numIslands(cloneGrid(grid))).toBe(2);
  });
});
