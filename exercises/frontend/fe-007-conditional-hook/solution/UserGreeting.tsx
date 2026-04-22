import { useState, useEffect } from "react";

interface UserGreetingProps {
  isLoggedIn: boolean;
  username: string;
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function UserGreeting({ isLoggedIn, username }: UserGreetingProps) {
  // FIX: All hooks called unconditionally at top level
  const [visitCount, setVisitCount] = useState(0);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      setVisitCount((prev) => prev + 1);
      setGreeting(`Good ${getTimeOfDay()}, ${username}!`);
    }
  }, [isLoggedIn, username]);

  if (!isLoggedIn) {
    return (
      <div data-testid="login-prompt">
        <p>Please log in to continue.</p>
      </div>
    );
  }

  return (
    <div data-testid="greeting-container">
      <h2 data-testid="greeting-message">{greeting}</h2>
      <p data-testid="visit-count">Visits: {visitCount}</p>
      <p data-testid="user-status">Status: Active</p>
    </div>
  );
}
