import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile, type UserApiClient, type User } from "../UserProfile";

// BUG: These tests mock at the wrong level. Instead of providing a fake
// apiClient (the dependency injection boundary), they mock React hooks
// and internal state, making the tests tightly coupled to implementation.
// The tests don't verify actual user flows -- they test wiring, not behavior.

const mockUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  bio: "Software engineer",
};

// BUG: Mocking React's useState and useEffect directly
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: vi.fn(),
    useEffect: vi.fn(),
  };
});

describe("UserProfile", () => {
  const mockApiClient: UserApiClient = {
    getUser: vi.fn(),
    updateUser: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    // BUG: Manually controlling useState to simulate loading
    const { useState } = require("react");
    useState
      .mockReturnValueOnce([null, vi.fn()])     // user
      .mockReturnValueOnce([true, vi.fn()])     // loading
      .mockReturnValueOnce([null, vi.fn()])     // error
      .mockReturnValueOnce([false, vi.fn()])    // editing
      .mockReturnValueOnce(["", vi.fn()])       // editName
      .mockReturnValueOnce(["", vi.fn()])       // editBio
      .mockReturnValueOnce([false, vi.fn()]);   // saving

    render(<UserProfile userId="user-1" apiClient={mockApiClient} />);

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("should display user data after loading", () => {
    // BUG: Manually setting state to "loaded" -- never actually calls API
    const { useState } = require("react");
    useState
      .mockReturnValueOnce([mockUser, vi.fn()])
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce([null, vi.fn()])
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce(["Jane Doe", vi.fn()])
      .mockReturnValueOnce(["Software engineer", vi.fn()])
      .mockReturnValueOnce([false, vi.fn()]);

    render(<UserProfile userId="user-1" apiClient={mockApiClient} />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("should show error state", () => {
    // BUG: Manually setting error state -- API is never called
    const { useState } = require("react");
    useState
      .mockReturnValueOnce([null, vi.fn()])
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce(["Network error", vi.fn()])
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce(["", vi.fn()])
      .mockReturnValueOnce(["", vi.fn()])
      .mockReturnValueOnce([false, vi.fn()]);

    render(<UserProfile userId="user-1" apiClient={mockApiClient} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Network error");
  });

  it("should switch to edit mode", () => {
    // BUG: Even this click test relies on mocked useState
    const setEditing = vi.fn();
    const { useState } = require("react");
    useState
      .mockReturnValueOnce([mockUser, vi.fn()])
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce([null, vi.fn()])
      .mockReturnValueOnce([false, setEditing])
      .mockReturnValueOnce(["Jane Doe", vi.fn()])
      .mockReturnValueOnce(["Software engineer", vi.fn()])
      .mockReturnValueOnce([false, vi.fn()]);

    render(<UserProfile userId="user-1" apiClient={mockApiClient} />);

    // BUG: Checks that setEditing would be called, not that the UI changes
    const editButton = screen.getByText("Edit Profile");
    expect(editButton).toBeInTheDocument();
  });
});
