import { describe, it, expect } from "vitest";
import { simplifyPath } from "../solution";

describe("simplifyPath", () => {
  it("should simplify a basic path with trailing slash", () => {
    expect(simplifyPath("/home/")).toBe("/home");
  });

  it("should handle parent directory navigation", () => {
    expect(simplifyPath("/a/b/../c")).toBe("/a/c");
  });

  it("should handle multiple parent directory navigations", () => {
    expect(simplifyPath("/a/./b/../../c/")).toBe("/c");
  });

  it("should not go above root with '..'", () => {
    expect(simplifyPath("/../")).toBe("/");
  });

  it("should handle multiple consecutive slashes", () => {
    expect(simplifyPath("/home//foo/")).toBe("/home/foo");
  });

  it("should return root for root path", () => {
    expect(simplifyPath("/")).toBe("/");
  });

  it("should handle complex path with mixed navigation", () => {
    expect(simplifyPath("/a/b/c/../../d/e/../f")).toBe("/a/d/f");
  });

  it("should handle current directory dots", () => {
    expect(simplifyPath("/a/./b/./c")).toBe("/a/b/c");
  });

  it("should handle going up multiple levels beyond root", () => {
    expect(simplifyPath("/a/../../..")).toBe("/");
  });

  it("should handle path with only dots and slashes", () => {
    expect(simplifyPath("/./././.")).toBe("/");
  });

  it("should preserve directory names that look like dots but aren't", () => {
    expect(simplifyPath("/a/...")).toBe("/a/...");
  });

  it("should handle deeply nested path with parent navigation back to root", () => {
    expect(simplifyPath("/x/y/z/../../../")).toBe("/");
  });
});
