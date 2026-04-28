# Hint 2 (Medium)

The **type-state pattern** uses a generic parameter to track what has been configured:

```typescript
// Each method returns a NEW generic type that includes the field
host(value: string): QueryBuilder<State & { host: true }> { ... }
```

After calling `.host("localhost").port(5432)`, the type becomes:
```
QueryBuilder<{} & { host: true } & { port: true }>
```

For `HasAllRequired`, the condition `RequiredKeys extends keyof State` checks if **every** required key exists in State. When true, return `true` (not `false` -- the condition was inverted).

For `build()`, use a **`this` parameter** to restrict when it can be called:
```typescript
build(this: SomeConstraint): ConfigFields { ... }
```

The `this` parameter is a TypeScript-only construct that constrains which object types can call the method.
