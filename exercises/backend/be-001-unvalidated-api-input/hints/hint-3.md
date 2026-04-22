# Hint 3 (Strong)

Replace the direct destructuring with Zod validation:

```ts
import { z } from "zod";

const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});

// In the handler:
const result = CreateProductSchema.safeParse(body);
if (!result.success) {
  const errors = result.error.issues.map((issue) => ({
    field: String(issue.path[0] ?? "unknown"),
    message: issue.message,
  }));
  return { status: 400, body: { error: "Validation failed", errors } };
}
const { name, price, category } = result.data;
```
