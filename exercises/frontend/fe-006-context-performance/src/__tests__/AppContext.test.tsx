import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  App,
  getThemeDisplayRenders,
  getNotificationDisplayRenders,
  resetRenderCounts,
} from "../AppContext";

describe("AppContext Performance", () => {
  beforeEach(() => {
    resetRenderCounts();
  });

  it("renders theme and notifications", () => {
    render(<App />);
    expect(screen.getByTestId("theme-display")).toHaveTextContent("Current theme: light");
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("Notifications: 5");
  });

  it("toggles theme", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId("toggle-theme"));
    expect(screen.getByTestId("theme-display")).toHaveTextContent("Current theme: dark");
  });

  it("clears notifications", async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId("clear-notifications"));
    expect(screen.getByTestId("notification-badge")).toHaveTextContent("Notifications: 0");
  });

  it("does not cause extra ThemeDisplay renders when notifications change", async () => {
    render(<App />);
    const user = userEvent.setup();

    const initialThemeRenders = getThemeDisplayRenders();

    // Change notifications — should NOT cause ThemeDisplay to re-render
    await user.click(screen.getByTestId("add-notification"));
    await user.click(screen.getByTestId("add-notification"));
    await user.click(screen.getByTestId("clear-notifications"));

    // ThemeDisplay should not have rendered again since theme didn't change
    // Allow for at most 1 extra render (React internal batching), but not 3+
    const additionalRenders = getThemeDisplayRenders() - initialThemeRenders;
    expect(additionalRenders).toBeLessThanOrEqual(1);
  });

  it("does not cause extra NotificationBadge renders when theme changes", async () => {
    render(<App />);
    const user = userEvent.setup();

    const initialNotifRenders = getNotificationDisplayRenders();

    // Change theme — should NOT cause NotificationBadge to re-render
    await user.click(screen.getByTestId("toggle-theme"));
    await user.click(screen.getByTestId("toggle-theme"));

    // NotificationBadge should not have rendered again since notifications didn't change
    const additionalRenders = getNotificationDisplayRenders() - initialNotifRenders;
    expect(additionalRenders).toBeLessThanOrEqual(1);
  });
});
