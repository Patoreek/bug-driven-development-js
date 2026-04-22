interface UserCardProps {
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  onContact?: (email: string) => void;
}

export function UserCard({ name, email, role, avatarUrl, onContact }: UserCardProps) {
  const roleLabel = {
    admin: "Administrator",
    editor: "Editor",
    viewer: "Viewer",
  }[role];

  return (
    <div data-testid="user-card" className="user-card">
      {avatarUrl && (
        <img src={avatarUrl} alt={`${name}'s avatar`} className="user-card__avatar" />
      )}
      <div className="user-card__info">
        <h2 className="user-card__name">{name}</h2>
        <p className="user-card__email">{email}</p>
        <span className="user-card__role">{roleLabel}</span>
      </div>
      {onContact && (
        <button
          onClick={() => onContact(email)}
          className="user-card__contact-btn"
        >
          Contact
        </button>
      )}
    </div>
  );
}
