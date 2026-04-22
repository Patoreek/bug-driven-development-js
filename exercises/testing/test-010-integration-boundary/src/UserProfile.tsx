import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

export interface UserApiClient {
  getUser: (id: string) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
}

interface UserProfileProps {
  userId: string;
  apiClient: UserApiClient;
}

export function UserProfile({ userId, apiClient }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getUser(userId);
        if (!cancelled) {
          setUser(data);
          setEditName(data.name);
          setEditBio(data.bio);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load user");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId, apiClient]);

  const handleSave = async () => {
    if (!user) return;
    if (!editName.trim()) return;

    setSaving(true);
    try {
      const updated = await apiClient.updateUser(user.id, {
        name: editName.trim(),
        bio: editBio.trim(),
      });
      setUser(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio);
    }
    setEditing(false);
  };

  if (loading) {
    return <div role="status">Loading profile...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label htmlFor="edit-name">Name</label>
          <input
            id="edit-name"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="edit-bio">Bio</label>
          <textarea
            id="edit-bio"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={handleCancel} disabled={saving}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.bio}</p>
      <button onClick={() => setEditing(true)}>Edit Profile</button>
    </div>
  );
}
