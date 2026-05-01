/**
 * LeetCode 71 - Simplify Path
 *
 * Given an absolute Unix-style file path, simplify it by converting it
 * to the canonical path.
 *
 * Approach: Use a stack. Push directory names, pop on "..",
 * skip "." and empty strings.
 *
 * Time: O(n) | Space: O(n)
 */
export function simplifyPath(path: string): string {
  const parts = path.split("/");
  const stack: string[] = [];

  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
}
