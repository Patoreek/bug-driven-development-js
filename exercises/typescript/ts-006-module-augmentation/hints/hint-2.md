# Hint 2 (Medium)

In a real Express project, you'd use module augmentation to extend the Request type:

```ts
declare module "express" {
  interface Request {
    user?: { id: string; name: string; role: string };
    requestId?: string;
  }
}
```

In this exercise, since you own the `Request` interface (it's not from a third-party module), the simplest approach is to add the optional properties directly to the existing `Request` interface. This is called "declaration merging" -- when two interface declarations with the same name exist in the same scope, TypeScript merges them.

Once `Request` includes `user?` and `requestId?`, all middleware signatures can use plain `Request` and be compatible with the `Middleware` type.
