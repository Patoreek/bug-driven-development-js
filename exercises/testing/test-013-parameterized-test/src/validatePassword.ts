export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "strong" | "very-strong";
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Must be at least 8 characters");
  }

  if (password.length > 128) {
    errors.push("Must be at most 128 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Must contain a lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain an uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain a digit");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Must contain a special character");
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push("Must not contain 3 or more repeated characters");
  }

  if (/\s/.test(password)) {
    errors.push("Must not contain whitespace");
  }

  const commonPasswords = [
    "password", "12345678", "qwerty123", "letmein1",
    "admin123", "welcome1", "monkey12", "dragon12",
  ];
  if (commonPasswords.some((cp) => password.toLowerCase().includes(cp))) {
    errors.push("Must not contain a common password pattern");
  }

  // Calculate strength
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  if (!/(.)\1{2,}/.test(password)) score++;

  let strength: PasswordValidationResult["strength"];
  if (score <= 2) strength = "weak";
  else if (score <= 4) strength = "fair";
  else if (score <= 5) strength = "strong";
  else strength = "very-strong";

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}
