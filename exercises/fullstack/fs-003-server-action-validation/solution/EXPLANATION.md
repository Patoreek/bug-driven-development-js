# Solution: Server Action Validation

## The Bug

The `createTicket` server action blindly trusts raw form data:

```ts
const title = formData.get("title") as string;
const description = formData.get("description") as string;
const priority = Number(formData.get("priority"));
const email = formData.get("email") as string;
```

There is zero validation. The `as string` casts tell TypeScript to stop complaining but do not actually validate anything at runtime. Missing fields, empty strings, non-numeric priorities, and invalid emails all pass through to the database.

## The Fix

Add Zod schema validation before processing the data:

```ts
import { z } from "zod/v4";

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().min(1, "Description is required"),
  priority: z.coerce.number().int().min(1, "Priority must be between 1 and 5").max(5, "Priority must be between 1 and 5"),
  email: z.email("Invalid email address"),
});
```

Use `safeParse` to validate without throwing, then map Zod issues to a `fieldErrors` record:

```ts
const result = ticketSchema.safeParse(raw);
if (!result.success) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return { success: false, fieldErrors };
}
```

Key details:
- `z.coerce.number()` converts the string from `FormData` to a number before applying `.min()` / `.max()`.
- Null/undefined fields are handled by defaulting to `""` with `formData.get("field") ?? ""`.
- The ticket is only created when validation passes.

## Key Takeaway

Server actions receive raw user input over the network. Client-side validation is a UX convenience, not a security measure -- it can be bypassed entirely. Always validate on the server. Zod's `safeParse` gives you structured errors without throwing, making it ideal for returning field-level error messages to the UI.

## Further Reading

- [Zod Documentation](https://zod.dev/) -- schema validation
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) -- form handling
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) -- security best practices

## Interview Context

"Why not just rely on client-side validation?" is a common interview question. The answer: any HTTP client can send arbitrary data to your server endpoint. Client validation improves UX; server validation enforces correctness and security. A production-grade server action always validates input before touching the database.
