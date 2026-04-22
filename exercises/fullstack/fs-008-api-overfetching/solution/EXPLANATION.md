# Solution: API Overfetching

## The Bug

Every data-fetching function returns the complete `User` object:

```ts
export function getUsersForList(): User[] {
  return getUsers(); // returns ALL 12+ fields
}
```

This is overfetching: sending phone numbers, addresses, and preferences to a sidebar component that only needs a name and avatar.

## The Fix

Define narrow return types and destructure only the needed fields:

```ts
export type UserListItem = Pick<User, "id" | "name" | "avatar">;

export function getUsersForList(): UserListItem[] {
  return users.map(({ id, name, avatar }) => ({ id, name, avatar }));
}
```

For the profile endpoint, use `Omit` and rest destructuring to exclude sensitive fields:

```ts
const { preferences, phone, address, ...publicProfile } = user;
return publicProfile;
```

## Key Takeaway

Overfetching wastes bandwidth, increases parse time, and can leak sensitive data. Shape API responses to match what each consumer needs. TypeScript's `Pick` and `Omit` utility types help enforce this at the type level. In REST APIs, this is typically done with field selection or dedicated endpoints. GraphQL solves overfetching by letting clients specify exactly which fields they need.

## Further Reading

- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [GraphQL vs REST](https://www.apollographql.com/blog/graphql-vs-rest-api-why-and-when-to-use-each)

## Interview Context

"How do you prevent overfetching in REST APIs?" is a common system design question. Good answers mention: (1) dedicated endpoints or DTOs per view, (2) field selection query parameters, (3) GraphQL as an alternative, and (4) BFF (Backend for Frontend) pattern for aggregation.
