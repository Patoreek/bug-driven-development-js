# Hint 3 (Strong)

```ts
import { timingSafeEqual } from "crypto";

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to avoid leaking timing info about length
    const bufA = Buffer.from(a);
    timingSafeEqual(bufA, bufA); // takes constant time
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return timingSafeEqual(bufA, bufB);
}
```

Then in `validateToken`, replace `providedToken === storedToken` with `safeCompare(providedToken, storedToken)`.
