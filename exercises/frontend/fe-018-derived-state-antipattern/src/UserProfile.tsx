import { useState, useEffect } from "react";

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

export function UserProfile({ user }: UserProfileProps) {
  // BUG: Copying props into state — these will be stale for one render cycle
  // when the user prop changes
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
  const [accountAge, setAccountAge] = useState("");
  const [emailDomain, setEmailDomain] = useState("");

  // BUG: useEffect runs AFTER render, so the first render after a prop change
  // shows stale values
  useEffect(() => {
    setFullName(`${user.firstName} ${user.lastName}`);
    setInitials(
      `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    );

    const joined = new Date(user.joinedAt);
    const now = new Date();
    const diffYears = now.getFullYear() - joined.getFullYear();
    const diffMonths = now.getMonth() - joined.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;
    if (totalMonths < 1) {
      setAccountAge("Less than a month");
    } else if (totalMonths < 12) {
      setAccountAge(`${totalMonths} month${totalMonths === 1 ? "" : "s"}`);
    } else {
      const years = Math.floor(totalMonths / 12);
      setAccountAge(`${years} year${years === 1 ? "" : "s"}`);
    }

    const domain = user.email.split("@")[1] || "";
    setEmailDomain(domain);
  }, [user]);

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
