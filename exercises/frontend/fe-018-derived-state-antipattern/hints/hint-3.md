Remove all the `useState` calls and the `useEffect`. Replace them with simple `const` declarations:

```tsx
export function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const emailDomain = user.email.split("@")[1] || "";
  const accountAge = computeAccountAge(user.joinedAt);

  return (/* JSX using these values */);
}
```

These values are now always in sync with the current `user` prop, with no render delay.
