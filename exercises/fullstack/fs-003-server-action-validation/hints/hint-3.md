# Hint 3 (Strong)

```ts
import { z } from "zod/v4";

const ticketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: z.coerce.number().int().min(1).max(5),
  email: z.email(),
});

const result = ticketSchema.safeParse(raw);
if (!result.success) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    fieldErrors[String(issue.path[0])] = issue.message;
  }
  return { success: false, fieldErrors };
}
```

`z.coerce.number()` converts the string from FormData to a number before validation.
