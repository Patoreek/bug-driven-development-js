/**
 * Parses an array of string scores into integers.
 * e.g., ["85", "92", "78"] => [85, 92, 78]
 */
export function parseScores(stringScores: string[]): number[] {
  return stringScores.map(parseInt);
}

/**
 * Parses an array of string values into floating-point numbers.
 * e.g., ["3.14", "2.71", "1.41"] => [3.14, 2.71, 1.41]
 */
export function parseFloats(stringValues: string[]): number[] {
  return stringValues.map(parseFloat);
}

/**
 * Converts an array of pixel value strings to numbers.
 * e.g., ["16px", "24px", "8px"] => [16, 24, 8]
 */
export function parsePixelValues(pixelStrings: string[]): number[] {
  return pixelStrings.map(parseInt);
}
