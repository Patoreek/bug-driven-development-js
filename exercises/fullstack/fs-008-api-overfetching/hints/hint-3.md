# Hint 3 (Strong)

```ts
export type UserListItem = Pick<User, "id" | "name" | "avatar">;
export type UserCardItem = Pick<User, "id" | "name" | "role" | "department">;
export type UserPublicProfile = Omit<User, "preferences" | "phone" | "address">;

export function getUsersForList(): UserListItem[] {
  return users.map(({ id, name, avatar }) => ({ id, name, avatar }));
}

export function getUsersForCard(): UserCardItem[] {
  return users.map(({ id, name, role, department }) => ({ id, name, role, department }));
}

export function getUserProfile(id: string): UserPublicProfile | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  const { preferences, phone, address, ...publicProfile } = user;
  return publicProfile;
}
```
