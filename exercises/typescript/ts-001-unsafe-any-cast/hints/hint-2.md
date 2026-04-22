# Hint 2 (Medium)

Instead of `as any`, keep the parameter typed as `unknown` and use runtime checks to narrow the type step by step:

1. First check `typeof value === "object" && value !== null` to confirm it's an object
2. Then check individual properties with `typeof` checks
3. For enum values like `role`, check against a set of valid values

A helper function like `isRecord(value): value is Record<string, unknown>` can simplify repeated object checks.
