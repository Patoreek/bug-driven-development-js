# Hint 3 (Strong)

Add the custom properties directly to the `Request` and `Response` interfaces:

```ts
export interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  // Augmented properties
  user?: { id: string; name: string; role: "admin" | "user" };
  requestId?: string;
}

export interface Response {
  status(code: number): Response;
  json(data: unknown): void;
  send(body: string): void;
  locals?: Record<string, unknown>;
}
```

Then remove `ExtendedRequest` and `ExtendedResponse` entirely, and change all middleware signatures to use plain `Request` and `Response`:

```ts
export function authMiddleware(req: Request, _res: Response, next: () => void): void { ... }
export function getUserRole(req: Request): string {
  return req.user?.role ?? "anonymous";  // no `as any` needed
}
```
