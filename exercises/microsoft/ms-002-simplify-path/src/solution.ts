/**
 * LeetCode 71 - Simplify Path
 *
 * Given an absolute Unix-style file path, simplify it by converting it
 * to the canonical path.
 *
 * Rules:
 * - "." refers to the current directory
 * - ".." refers to the parent directory
 * - Multiple consecutive slashes are treated as a single slash
 * - The canonical path starts with a single "/"
 * - The canonical path does not end with a trailing "/"
 *
 * BUG: When encountering "..", this solution skips the ".." token
 * but does NOT pop the previous directory from the result stack.
 * So "/a/b/../c" incorrectly returns "/a/b/c" instead of "/a/c".
 */
export function simplifyPath(path: string): string {
  const parts = path.split("/");
  const result: string[] = [];

  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") continue; // BUG: should pop from result
    result.push(part);
  }

  return "/" + result.join("/");
}
