// This is a Server Component (no "use client" directive)

import { LikeButton } from "./LikeButton";

type User = {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
};

async function fetchUser(userId: string): Promise<User> {
  return {
    id: userId,
    name: "Jane Doe",
    bio: "Full-stack developer and open source contributor.",
    avatarUrl: "/avatars/jane.png",
  };
}

export async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);

  // FIX: Don't pass function props across the server-client boundary.
  // LikeButton handles its own logic internally.
  return (
    <div data-testid="user-profile">
      <img src={user.avatarUrl} alt={user.name} />
      <h2 data-testid="user-name">{user.name}</h2>
      <p data-testid="user-bio">{user.bio}</p>
      <LikeButton userId={user.id} />
    </div>
  );
}
