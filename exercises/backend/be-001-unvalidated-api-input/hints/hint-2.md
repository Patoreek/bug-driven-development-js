# Hint 2 (Medium)

The project uses Zod for runtime validation. You need to:
1. Define a `z.object()` schema with constraints for each field
2. Use `z.string().min(1)` to reject empty strings
3. Use `z.number().positive()` to reject zero and negative numbers
4. Call `.safeParse(body)` to validate without throwing
