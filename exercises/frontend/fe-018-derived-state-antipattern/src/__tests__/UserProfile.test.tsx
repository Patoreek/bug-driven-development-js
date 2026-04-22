import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UserProfile, type User } from "../UserProfile";

describe("UserProfile", () => {
  const mockUser: User = {
    id: "u1",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    joinedAt: "2023-01-15T00:00:00Z",
  };

  let dateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Fix "now" to a known date for consistent account age calculations
    dateSpy = vi.spyOn(Date, "now").mockReturnValue(
      new Date("2025-01-15T00:00:00Z").getTime()
    );
    // Also mock the Date constructor for new Date()
    const RealDate = Date;
    vi.spyOn(globalThis, "Date").mockImplementation((...args: unknown[]) => {
      if (args.length === 0) {
        return new RealDate("2025-01-15T00:00:00Z");
      }
      // @ts-expect-error - spread args for Date constructor
      return new RealDate(...args);
    });
    // Preserve static methods
    Object.assign(globalThis.Date, RealDate);
    globalThis.Date.now = () => new RealDate("2025-01-15T00:00:00Z").getTime();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays the full name", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByTestId("full-name")).toHaveTextContent("Jane Doe");
  });

  it("displays initials in the avatar", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByTestId("avatar")).toHaveTextContent("JD");
  });

  it("displays the email", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByTestId("email")).toHaveTextContent("jane@example.com");
  });

  it("displays the email domain", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByTestId("email-domain")).toHaveTextContent("@example.com");
  });

  it("displays account age in years", () => {
    render(<UserProfile user={mockUser} />);
    // Joined Jan 2023, now is Jan 2025 = 2 years
    expect(screen.getByTestId("account-age")).toHaveTextContent(
      "Member for 2 years"
    );
  });

  it("displays account age in months for recent accounts", () => {
    const recentUser: User = {
      ...mockUser,
      joinedAt: "2024-08-15T00:00:00Z",
    };
    render(<UserProfile user={recentUser} />);
    // Joined Aug 2024, now is Jan 2025 = 5 months
    expect(screen.getByTestId("account-age")).toHaveTextContent(
      "Member for 5 months"
    );
  });

  it("updates immediately when user prop changes — no stale render", () => {
    const user1: User = {
      id: "u1",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      joinedAt: "2023-01-15T00:00:00Z",
    };
    const user2: User = {
      id: "u2",
      firstName: "John",
      lastName: "Smith",
      email: "john@company.org",
      joinedAt: "2024-06-15T00:00:00Z",
    };

    const { rerender } = render(<UserProfile user={user1} />);
    expect(screen.getByTestId("full-name")).toHaveTextContent("Jane Doe");
    expect(screen.getByTestId("avatar")).toHaveTextContent("JD");

    // Rerender with a different user — values should update IMMEDIATELY
    rerender(<UserProfile user={user2} />);

    // These assertions verify no stale data from the previous user
    expect(screen.getByTestId("full-name")).toHaveTextContent("John Smith");
    expect(screen.getByTestId("avatar")).toHaveTextContent("JS");
    expect(screen.getByTestId("email")).toHaveTextContent("john@company.org");
    expect(screen.getByTestId("email-domain")).toHaveTextContent("@company.org");
  });

  it("does not use useEffect to derive values from props", () => {
    // This test checks that the component computes values synchronously.
    // If useEffect is used, the first render after a rerender shows stale values.
    const user1: User = {
      id: "u1",
      firstName: "Alice",
      lastName: "Brown",
      email: "alice@test.com",
      joinedAt: "2024-01-15T00:00:00Z",
    };
    const user2: User = {
      id: "u2",
      firstName: "Bob",
      lastName: "Wilson",
      email: "bob@other.com",
      joinedAt: "2024-10-15T00:00:00Z",
    };

    const renderResults: string[] = [];

    const { rerender } = render(<UserProfile user={user1} />);
    renderResults.push(
      screen.getByTestId("full-name").textContent || ""
    );

    rerender(<UserProfile user={user2} />);
    renderResults.push(
      screen.getByTestId("full-name").textContent || ""
    );

    // After rerender, the name should immediately be Bob Wilson
    // If it's still Alice Brown, useEffect hasn't run yet (stale state)
    expect(renderResults[1]).toBe("Bob Wilson");
  });
});
