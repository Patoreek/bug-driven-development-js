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
  // BUG: Hook called inside conditional — violates rules of hooks
  if (isLoggedIn) {
    const [visitCount, setVisitCount] = useState(0);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
      setVisitCount((prev) => prev + 1);
      setGreeting(`Good ${getTimeOfDay()}, ${username}!`);
    }, [username]);

    return (
      <div data-testid="greeting-container">
        <h2 data-testid="greeting-message">{greeting}</h2>
        <p data-testid="visit-count">Visits: {visitCount}</p>
        <p data-testid="user-status">Status: Active</p>
      </div>
    );
  }

  return (
    <div data-testid="login-prompt">
      <p>Please log in to continue.</p>
    </div>
  );
}
