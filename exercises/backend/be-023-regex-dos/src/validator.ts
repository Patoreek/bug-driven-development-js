// Input validation utilities for a web application.
// BUG: Several regex patterns are vulnerable to ReDoS (Regular Expression
// Denial of Service) because they use nested quantifiers that cause
// catastrophic backtracking on crafted inputs.

/**
 * Validates an email address.
 * BUG: The nested quantifiers [a-zA-Z0-9._%+-]+ followed by a pattern
 * that can partially overlap causes exponential backtracking on inputs
 * like "aaaaaaaaaaaaaaaaaaaaa@" (long local part with no valid domain).
 */
export function isValidEmail(input: string): boolean {
  // BUG: Catastrophic backtracking with nested quantifiers
  const emailRegex = /^([a-zA-Z0-9._%-]+)+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
}

/**
 * Validates a URL.
 * BUG: The (.*) inside repeated groups causes catastrophic backtracking
 * on long strings that almost-but-don't-quite match.
 */
export function isValidUrl(input: string): boolean {
  // BUG: Nested quantifiers + overlapping character classes
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+(\.[\w.-]+)+([\/\w ._~:?#[\]@!$&'()*+,;=-]*)*$/;
  return urlRegex.test(input);
}

/**
 * Checks if a string contains only valid JSON-safe characters.
 * BUG: The alternation with overlapping groups causes exponential backtracking.
 */
export function isSafeJsonString(input: string): boolean {
  // BUG: Overlapping alternation with quantifiers
  const safeRegex = /^([a-zA-Z0-9 ]*|[a-zA-Z0-9 _-]*)*$/;
  return safeRegex.test(input);
}

/**
 * Validates a slug (URL-friendly string).
 * BUG: The pattern [a-z0-9-]+ repeated in a group causes backtracking
 * when followed by characters that partially match.
 */
export function isValidSlug(input: string): boolean {
  // BUG: Nested quantifier — ([a-z0-9-]+)+ is the classic ReDoS pattern
  const slugRegex = /^([a-z0-9-]+)+$/;
  return slugRegex.test(input);
}

/**
 * Executes a validation with a timeout to prevent long-running regex.
 * Returns false if the regex takes too long.
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
