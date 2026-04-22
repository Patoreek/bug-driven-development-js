import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationList } from "../src/NotificationList";

// FIX: All hardcoded delays replaced with proper waitFor/findBy queries

describe("NotificationList", () => {
  it("shows loading spinner initially", () => {
    render(<NotificationList />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays notifications after loading", async () => {
    render(<NotificationList />);

    // FIX: Use findByTestId which automatically waits for the element
    expect(await screen.findByTestId("notification-list")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n1")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n2")).toBeInTheDocument();
    expect(screen.getByTestId("notification-n3")).toBeInTheDocument();
  });

  it("shows unread badge with correct count", async () => {
    render(<NotificationList />);

    // FIX: Wait for the badge to appear
    const badge = await screen.findByTestId("unread-badge");
    expect(badge).toHaveTextContent("(2)");
  });

  it("marks notification as read", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // FIX: Wait for notifications to load
    const markReadBtn = await screen.findByTestId("mark-read-n1");
    await user.click(markReadBtn);

    // FIX: Wait for the button to disappear after async operation
    await waitFor(() => {
      expect(screen.queryByTestId("mark-read-n1")).not.toBeInTheDocument();
    });
  });

  it("dismisses a notification", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // FIX: Wait for notifications to load
    const dismissBtn = await screen.findByTestId("dismiss-n1");
    await user.click(dismissBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("notification-n1")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when all notifications dismissed", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // FIX: Wait for notifications to load before dismissing
    await screen.findByTestId("notification-list");

    await user.click(screen.getByTestId("dismiss-n1"));
    await user.click(screen.getByTestId("dismiss-n2"));
    await user.click(screen.getByTestId("dismiss-n3"));

    expect(await screen.findByTestId("empty-state")).toHaveTextContent(
      "No notifications"
    );
  });

  it("updates unread badge after marking as read", async () => {
    const user = userEvent.setup();
    render(<NotificationList />);

    // FIX: Wait for initial load
    const badge = await screen.findByTestId("unread-badge");
    expect(badge).toHaveTextContent("(2)");

    await user.click(screen.getByTestId("mark-read-n1"));

    // FIX: Wait for badge to update
    await waitFor(() => {
      expect(screen.getByTestId("unread-badge")).toHaveTextContent("(1)");
    });
  });
});
