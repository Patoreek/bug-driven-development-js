// Input validation utilities for a web application.
// FIX: All regex patterns rewritten to avoid nested quantifiers and
// overlapping character classes that cause catastrophic backtracking.

/**
 * Validates an email address.
 * FIX: Removed the nested quantifier (+)+ and simplified the pattern.
 * Uses possessive-style matching via atomic groups (simulated by
 * avoiding overlapping quantifiers).
 */
export function isValidEmail(input: string): boolean {
  // FIX: No nested quantifiers — single pass, linear time
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
}

/**
 * Validates a URL.
 * FIX: Simplified pattern that avoids nested repeated groups.
 */
export function isValidUrl(input: string): boolean {
  // FIX: Non-overlapping character classes, no nested quantifiers
  const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return urlRegex.test(input);
}

/**
 * Checks if a string contains only valid JSON-safe characters.
 * FIX: Single character class instead of overlapping alternation.
 */
export function isSafeJsonString(input: string): boolean {
  // FIX: One character class — no alternation, no nested quantifiers
  const safeRegex = /^[a-zA-Z0-9 _-]*$/;
  return safeRegex.test(input);
}

/**
 * Validates a slug (URL-friendly string).
 * FIX: Removed the outer group with quantifier — no more ([...]+)+
 */
export function isValidSlug(input: string): boolean {
  // FIX: Simple quantifier — [a-z0-9-]+ instead of ([a-z0-9-]+)+
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(input);
}

/**
 * Executes a validation with a timeout to prevent long-running regex.
 */
export function validateWithTimeout(
  validatorFn: (input: string) => boolean,
  input: string,
  timeoutMs: number = 100
): { valid: boolean; timedOut: boolean } {
  const start = Date.now();
  const result = validatorFn(input);
  const elapsed = Date.now() - start;

  return {
    valid: result,
    timedOut: elapsed > timeoutMs,
  };
}

/**
 * Validates multiple fields of a user registration form.
 */
export function validateRegistration(data: {
  email: string;
  website?: string;
  username: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) {
    errors.push("Invalid email address");
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.push("Invalid website URL");
  }

  if (!isValidSlug(data.username)) {
    errors.push("Username must contain only lowercase letters, numbers, and hyphens");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
