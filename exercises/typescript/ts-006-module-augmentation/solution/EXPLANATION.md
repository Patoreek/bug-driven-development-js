# Solution: Module Augmentation

## The Bug

The code creates separate interfaces and uses intersection types instead of augmenting the original interface:

```ts
// BUG: Separate interface — doesn't merge with Request
interface ExtendedRequest {
  user?: { id: string; name: string; role: string };
  requestId?: string;
}

// BUG: Intersection type — incompatible with Middleware's Request parameter
export function authMiddleware(
  req: Request & ExtendedRequest,  // not assignable to Request
  _res: Response,
  next: () => void
): void { ... }

// BUG: Has to use `as any` because Request doesn't have `user`
export function getUserRole(req: Request): string {
  return (req as any).user?.role ?? "anonymous";
}
```

## The Fix

Add the custom properties directly to the existing `Request` interface:

```ts
// BEFORE: Separate interfaces + intersection types
interface ExtendedRequest { user?: ...; requestId?: string; }
function authMiddleware(req: Request & ExtendedRequest, ...): void

// AFTER: Properties merged into the original interface
export interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  user?: { id: string; name: string; role: "admin" | "user" };
  requestId?: string;
}

function authMiddleware(req: Request, ...): void  // compatible with Middleware type
```

In a real project with a third-party library, you'd use module augmentation:

```ts
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; name: string; role: string };
    requestId?: string;
  }
}
```

This uses TypeScript's declaration merging -- when two `interface` declarations with the same name exist for the same module, TypeScript combines their properties.

## Why This Matters

Declaration merging is one of TypeScript's most powerful features for extending third-party types. The key rules:

1. **Interfaces merge** -- two interfaces with the same name combine their members
2. **Module augmentation** -- `declare module "x" { interface Y { ... } }` adds to existing types
3. **Intersection vs merging** -- `A & B` creates a new type; merging extends the original type so all existing references see the new properties

The intersection approach breaks down in real codebases because every function that accepts the base type becomes incompatible with the extended type.

## Common Variations

- Express middleware adding `req.user`, `req.session`, `req.tenantId`
- Extending `Window` or `globalThis` with custom globals
- Extending `ProcessEnv` with environment variable types
- Adding properties to library types like Prisma models or Next.js page props

## Interview Context

Module augmentation is commonly asked about in the context of: "How would you add a custom property to Express's Request type?" The answer involves `declare module` + interface merging. Understanding why intersection types don't work for this use case (type incompatibility in function parameters) demonstrates a deep understanding of TypeScript's type system.

## Further Reading

- [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
