import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Simulated API call
async function fetchUser(config: { userId: number; includeRole: boolean }): Promise<User> {
  return {
    id: config.userId,
    name: "Jane Smith",
    email: "jane@example.com",
    role: config.includeRole ? "Admin" : "Unknown",
  };
}

let fetchCount = 0;

export function getFetchCount() {
  return fetchCount;
}

export function resetFetchCount() {
  fetchCount = 0;
}

export function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [includeRole, setIncludeRole] = useState(true);

  // BUG: This object is recreated on every render with a new reference
  const fetchConfig = { userId, includeRole };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCount++;

    fetchUser(fetchConfig).then((data) => {
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fetchConfig]); // Object reference changes every render!

  if (loading) {
    return <p data-testid="loading">Loading...</p>;
  }

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div data-testid="user-profile">
      <h2>{user.name}</h2>
      <p data-testid="user-email">Email: {user.email}</p>
      <p data-testid="user-role">Role: {user.role}</p>
      <button
        data-testid="toggle-role"
        onClick={() => setIncludeRole((prev) => !prev)}
      >
        {includeRole ? "Hide Role" : "Show Role"}
      </button>
    </div>
  );
}
