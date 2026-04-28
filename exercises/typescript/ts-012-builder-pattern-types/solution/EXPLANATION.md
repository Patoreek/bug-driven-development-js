# Solution: Builder Pattern Types -- Type-Safe Progressive Construction

## The Bug

The builder pattern is a common API design, but making it type-safe requires the type system to **track which methods have been called**. The buggy implementation's generic `State` parameter never changed -- every method returned the same `QueryBuilder<State>`, so TypeScript couldn't distinguish a fully-configured builder from an empty one.

## The Fixes

### 1. Builder methods update the State type

```typescript
// Before -- State never changes
host(value: string): QueryBuilder<State> { ... }

// After -- State accumulates via intersection
host(value: string): QueryBuilder<State & { host: true }> { ... }
port(value: number): QueryBuilder<State & { port: true }> { ... }
database(value: string): QueryBuilder<State & { database: true }> { ... }
ssl(value: boolean): QueryBuilder<State & { ssl: true }> { ... }
```

Each method returns a `QueryBuilder` whose `State` type is the previous state intersected with a new field marker. After chaining `.host().port().database()`, the state becomes `{} & { host: true } & { port: true } & { database: true }`.

### 2. HasAllRequired was inverted

```typescript
// Before -- true/false swapped
type HasAllRequired<State> = RequiredKeys extends keyof State ? false : true;

// After -- correct direction
type HasAllRequired<State> = RequiredKeys extends keyof State ? true : false;
```

`RequiredKeys extends keyof State` checks whether every member of the `"host" | "port" | "database"` union is present in the keys of `State`. When it is, the builder is complete.

### 3. build() uses a this parameter constraint

```typescript
// Before -- callable on any state
build(): ConfigFields { ... }

// After -- only callable when all required fields are set
build(
  this: QueryBuilder<State> & (HasAllRequired<State> extends true ? {} : never)
): ConfigFields { ... }
```

The `this` parameter is a TypeScript construct that constrains the type of the calling object. When `HasAllRequired<State>` is `false`, the constraint becomes `QueryBuilder<State> & never`, which simplifies to `never`. Since no value is assignable to `never`, the method becomes uncallable -- creating a compile-time error for incomplete builders.

### 4. Factory function with explicit type parameter

```typescript
// Before
function createQueryBuilder(): QueryBuilder { ... }

// After
function createQueryBuilder(): QueryBuilder<{}> {
  return new QueryBuilder<{}>();
}
```

The explicit `<{}>` type parameter ensures the empty state is tracked from the start.

## How It Works Together

```typescript
const builder = createQueryBuilder();     // QueryBuilder<{}>
  .host("localhost")                       // QueryBuilder<{ host: true }>
  .port(5432)                             // QueryBuilder<{ host: true } & { port: true }>
  .database("mydb")                       // QueryBuilder<{ host: true } & { port: true } & { database: true }>
  .build();                               // HasAllRequired = true, so build() is callable
```

If you skip `.database()`:
```typescript
createQueryBuilder()
  .host("localhost")
  .port(5432)
  .build();  // Compile error: HasAllRequired<{ host: true } & { port: true }> = false
```

## Key Takeaways

- **Type-state pattern**: Use generics to encode "what has happened" into the type, making illegal states unrepresentable
- **Intersection accumulation**: `State & { newField: true }` progressively builds up the state type
- **`this` parameter constraints**: TypeScript's `this` parameter lets you restrict when a method can be called based on the object's type
- **Conditional `never`**: `HasAllRequired<State> extends true ? {} : never` makes a method uncallable when the condition isn't met

## Related Documentation

- [Generic Classes](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes)
- [This Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#this-parameters)
- [Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## Interview Context

The type-safe builder pattern is an advanced interview topic that tests multiple TypeScript skills simultaneously:
- Understanding of generic type parameters and how they flow through method chains
- Using intersection types for type-level state accumulation
- Conditional types for compile-time validation
- The `this` parameter trick for method-level access control
- This pattern appears in real libraries like Kysely (type-safe SQL query builder), Zod (schema builder), and tRPC (API builder)
