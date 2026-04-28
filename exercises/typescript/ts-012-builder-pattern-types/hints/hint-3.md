# Hint 3 (Strong)

Here are the specific fixes:

**Builder methods** -- each returns an updated State:
```typescript
host(value: string): QueryBuilder<State & { host: true }> {
  this.config.host = value;
  return this as any;
}
// Same pattern for port(), database(), ssl()
```

**HasAllRequired** -- flip the boolean:
```typescript
// Before (inverted)
type HasAllRequired<State> = RequiredKeys extends keyof State ? false : true;

// After (correct)
type HasAllRequired<State> = RequiredKeys extends keyof State ? true : false;
```

**build()** -- use a `this` parameter with a conditional constraint:
```typescript
build(
  this: QueryBuilder<State> & (HasAllRequired<State> extends true ? {} : never)
): ConfigFields {
  // ...
}
```

When `HasAllRequired<State>` is `false`, the `this` constraint becomes `QueryBuilder<State> & never` which is `never`, making the method uncallable.

**createQueryBuilder** -- explicit type parameter:
```typescript
function createQueryBuilder(): QueryBuilder<{}> {
  return new QueryBuilder<{}>();
}
```
