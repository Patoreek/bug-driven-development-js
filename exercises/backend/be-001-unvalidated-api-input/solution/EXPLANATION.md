# Explanation: Unvalidated API Input

## The Bug

The original handler destructured `body` directly without any validation:

```ts
const { name, price, category } = body as CreateProductRequest;
```

This `as` cast tells TypeScript to trust the developer, but at runtime the data could be anything: missing fields, wrong types, empty strings, or negative numbers. The handler happily created "products" with `undefined` names or negative prices.

## The Fix

We added a Zod schema to validate the input before processing:

```ts
const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});
```

Using `safeParse()` instead of `parse()` prevents thrown exceptions and gives us structured error data we can return to the client:

```ts
const result = CreateProductSchema.safeParse(body);
if (!result.success) {
  // return 400 with structured error messages
}
```

## Key Takeaway

Never trust input from the client. TypeScript types exist only at compile time — they provide zero runtime protection. Always validate external input at the boundary of your system using a runtime validation library like Zod.
