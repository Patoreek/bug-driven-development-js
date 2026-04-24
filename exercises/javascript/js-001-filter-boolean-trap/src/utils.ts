/**
 * Returns all valid scores from the array.
 * Valid scores are numbers — null and undefined should be removed.
 * A score of 0 is valid (e.g., a student scored zero points).
 */
export function getValidScores(
  scores: (number | null | undefined)[]
): number[] {
  return scores.filter(Boolean) as number[];
}

/**
 * Returns all non-empty user display names.
 * Removes null and undefined entries, but keeps empty string ""
 * because some users intentionally set a blank display name.
 */
export function getDisplayNames(
  names: (string | null | undefined)[]
): string[] {
  return names.filter(Boolean) as string[];
}

/**
 * Returns all active feature flags.
 * Removes null and undefined entries, but keeps `false`
 * because `false` means the flag exists but is disabled.
 */
export function getFeatureFlags(
  flags: (boolean | null | undefined)[]
): boolean[] {
  return flags.filter(Boolean) as boolean[];
}
