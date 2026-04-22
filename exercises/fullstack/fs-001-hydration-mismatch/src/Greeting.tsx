import { useState } from "react";

type GreetingProps = {
  username: string;
};

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getLayout(): "compact" | "full" {
  return window.innerWidth < 768 ? "compact" : "full";
}

export function Greeting({ username }: GreetingProps) {
  const [greeting] = useState(getTimeOfDayGreeting());
  const [layout] = useState(getLayout());

  return (
    <div data-testid="greeting-banner" data-layout={layout}>
      {layout === "compact" ? (
        <p data-testid="greeting-text">
          {greeting}, {username}
        </p>
      ) : (
        <div>
          <h1 data-testid="greeting-text">
            {greeting}, {username}!
          </h1>
          <p data-testid="greeting-subtitle">Welcome back to your dashboard.</p>
        </div>
      )}
    </div>
  );
}
