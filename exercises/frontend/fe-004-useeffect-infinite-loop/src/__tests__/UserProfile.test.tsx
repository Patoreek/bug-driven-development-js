import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile, getFetchCount, resetFetchCount } from "../UserProfile";

describe("UserProfile", () => {
  beforeEach(() => {
    resetFetchCount();
  });

  it("renders user data after loading", async () => {
    render(<UserProfile userId={1} />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("jane@example.com");
    expect(screen.getByTestId("user-role")).toHaveTextContent("Admin");
  });

  it("fetches only once on mount (no infinite loop)", async () => {
    render(<UserProfile userId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Wait a bit to see if extra fetches happen
    await new Promise((r) => setTimeout(r, 100));

    // Should only fetch once on mount, not loop
    expect(getFetchCount()).toBe(1);
  });

  it("refetches when toggling role visibility", async () => {
    render(<UserProfile userId={1} />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    expect(getFetchCount()).toBe(1);

    await user.click(screen.getByTestId("toggle-role"));

    await waitFor(() => {
      expect(screen.getByTestId("user-role")).toHaveTextContent("Unknown");
    });

    // Should fetch exactly twice: once on mount, once after toggle
    expect(getFetchCount()).toBe(2);
  });

  it("does not exceed expected fetch count after multiple interactions", async () => {
    render(<UserProfile userId={1} />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    });

    // Toggle twice
    await user.click(screen.getByTestId("toggle-role"));
    await waitFor(() => {
      expect(screen.getByTestId("user-role")).toHaveTextContent("Unknown");
    });

    await user.click(screen.getByTestId("toggle-role"));
    await waitFor(() => {
      expect(screen.getByTestId("user-role")).toHaveTextContent("Admin");
    });

    // Should be exactly 3: mount + 2 toggles
    expect(getFetchCount()).toBe(3);
  });
});
