export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string; // ISO date string
}

interface UserProfileProps {
  user: User;
}

function computeAccountAge(joinedAt: string): string {
  const joined = new Date(joinedAt);
  const now = new Date();
  const diffYears = now.getFullYear() - joined.getFullYear();
  const diffMonths = now.getMonth() - joined.getMonth();
  const totalMonths = diffYears * 12 + diffMonths;
  if (totalMonths < 1) {
    return "Less than a month";
  } else if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths === 1 ? "" : "s"}`;
  } else {
    const years = Math.floor(totalMonths / 12);
    return `${years} year${years === 1 ? "" : "s"}`;
  }
}

export function UserProfile({ user }: UserProfileProps) {
  // Compute all derived values directly from props during render
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const emailDomain = user.email.split("@")[1] || "";
  const accountAge = computeAccountAge(user.joinedAt);

  return (
    <div data-testid="user-profile">
      <div data-testid="avatar" className="avatar">
        {initials}
      </div>
      <h2 data-testid="full-name">{fullName}</h2>
      <p data-testid="email">{user.email}</p>
      <p data-testid="email-domain">@{emailDomain}</p>
      <p data-testid="account-age">Member for {accountAge}</p>
    </div>
  );
}
