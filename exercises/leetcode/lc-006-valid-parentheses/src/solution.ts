/**
 * Valid Parentheses
 *
 * Given a string `s` containing just the characters
 * '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
 *
 * A string is valid if:
 * 1. Open brackets are closed by the same type of brackets.
 * 2. Open brackets are closed in the correct order.
 * 3. Every close bracket has a corresponding open bracket of the same type.
 *
 * Bug: This implementation only counts opening and closing brackets.
 * Equal counts does NOT mean the brackets are valid — it ignores
 * ordering and type matching (e.g., "([)]" has equal counts but is invalid).
 */
export function isValid(s: string): boolean {
  let openCount = 0;
  let closeCount = 0;

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      openCount++;
    } else if (char === ")" || char === "]" || char === "}") {
      closeCount++;
    }
  }

  return openCount === closeCount;
}
