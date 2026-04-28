/**
 * Valid Parentheses — Optimal Solution
 *
 * Stack-based matching: O(n) time, O(n) space.
 *
 * Push opening brackets onto the stack.
 * For closing brackets, pop and verify the match.
 * Valid if stack is empty at the end.
 */
export function isValid(s: string): boolean {
  const stack: string[] = [];
  const matchMap: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else if (char in matchMap) {
      if (stack.length === 0 || stack.pop() !== matchMap[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
