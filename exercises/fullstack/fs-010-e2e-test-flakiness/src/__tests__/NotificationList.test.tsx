import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationList } from "../NotificationList";

// BUG: These tests are flaky due to timing-dependent assertions.
// They use hardcoded delays and getBy queries for async content.

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("NotificationList", () => {
  it("shows loading spinner initially", () => {
    render(<NotificationList />);
    // This one is fine -- loading state is synchronous
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays notifications after loading", async () => {
    render(<NotificationList />);

    // BUG: Hardcoded delay that may not be long enough
    await act(async () => {
      await sleep(100);
    });

    // BUG: Uses getByTestId which throws immediately if not found
    expect(screen.getByTestId("notification-list")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n1")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n2")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n3")).toBeInTheDocument();
  });

  it("shows unread badge with correct count", async () => {
    render(<NotificationList />);

    // BUG: Arbitrary delay
    await act(async () => {
      await sleep(100);
    });

    expect(screen.getByTestId("unread-badge")).toHaveTextContent("(2)");
  });

  it("marks notification as read", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // BUG: Might not be enough time for fetch
    await act(async () => {
      await sleep(100);
    });

    await user.click(screen.getByTestId("mark-read-n1"));

    // BUG: Doesn't wait for the async markAsRead to complete
    await act(async () => {
      await sleep(50);
    });

    // After marking as read, the button should disappear
    expect(screen.queryByTestId("mark-read-n1")).not.toBeInTheDocument();
  });

  it("dismisses a notification", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // BUG: Fixed delay
    await act(async () => {
      await sleep(100);
    });

    await user.click(screen.getByTestId("dismiss-n1"));

    // This assertion may work since dismiss is synchronous, but the setup is fragile
    expect(screen.queryByTestId("notification-n1")).not.toBeInTheDocument();
  });

  it("shows empty state when all notifications dismissed", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // BUG: Fixed delay
    await act(async () => {
      await sleep(100);
    });

    // Dismiss all notifications
    await user.click(screen.getByTestId("dismiss-n1"));
    await user.click(screen.getByTestId("dismiss-n2"));
    await user.click(screen.getByTestId("dismiss-n3"));

    expect(screen.getByTestId("empty-state")).toHaveTextContent(
      "No notifications"
    );
  });

  it("updates unread badge after marking as read", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // BUG: Fixed delay
    await act(async () => {
      await sleep(100);
    });

    expect(screen.getByTestId("unread-badge")).toHaveTextContent("(2)");

    await user.click(screen.getByTestId("mark-read-n1"));

    // BUG: Doesn't wait for async operation
    await act(async () => {
      await sleep(50);
    });

    expect(screen.getByTestId("unread-badge")).toHaveTextContent("(1)");
  });
});
