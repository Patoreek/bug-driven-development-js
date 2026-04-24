import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeDisplay, ThemeBadge } from "../ThemeDisplay";
import { themeStore } from "../ThemeStore";

describe("ThemeDisplay — useSyncExternalStore", () => {
  beforeEach(() => {
    themeStore._reset();
  });

  it("renders with the initial theme from the store", () => {
    render(<ThemeDisplay />);
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: light"
    );
  });

  it("updates when the store changes via button click", () => {
    render(<ThemeDisplay />);

    fireEvent.click(screen.getByTestId("dark-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: dark"
    );
  });

  it("toggles between light and dark", () => {
    render(<ThemeDisplay />);

    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: dark"
    );

    fireEvent.click(screen.getByTestId("toggle-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: light"
    );
  });

  it("supports all three theme values", () => {
    render(<ThemeDisplay />);

    fireEvent.click(screen.getByTestId("dark-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");

    fireEvent.click(screen.getByTestId("system-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");

    fireEvent.click(screen.getByTestId("light-btn"));
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("reflects external store changes (store updated outside component)", () => {
    render(<ThemeDisplay />);

    // Simulate an external change (another part of the app updates the store)
    act(() => {
      themeStore.setTheme("dark");
    });

    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: dark"
    );
    expect(screen.getByTestId("theme-container")).toHaveAttribute(
      "data-theme",
      "dark"
    );
  });

  it("stays in sync when store changes before subscription (mount-time race)", () => {
    // Change the store BEFORE rendering the component
    themeStore.setTheme("dark");

    render(<ThemeDisplay />);

    // The component must show "dark" immediately on first render,
    // not "light" then "dark" after an effect fires
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: dark"
    );
  });

  it("two components reading the same store show consistent values", () => {
    render(
      <div>
        <ThemeDisplay />
        <ThemeBadge />
      </div>
    );

    // Both should show "light" initially
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("theme-badge")).toHaveTextContent("light");

    // Change the store
    act(() => {
      themeStore.setTheme("dark");
    });

    // Both must update consistently — no tearing
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("theme-badge")).toHaveTextContent("dark");
  });

  it("cleans up subscription on unmount", () => {
    const { unmount } = render(<ThemeDisplay />);

    unmount();

    // Changing the store after unmount should not cause errors
    expect(() => {
      act(() => {
        themeStore.setTheme("dark");
      });
    }).not.toThrow();
  });

  it("handles rapid store updates without missing any", () => {
    render(<ThemeDisplay />);

    act(() => {
      themeStore.setTheme("dark");
      themeStore.setTheme("system");
      themeStore.setTheme("light");
      themeStore.setTheme("dark");
    });

    // Should reflect the final value
    expect(screen.getByTestId("current-theme")).toHaveTextContent(
      "Current theme: dark"
    );
  });
});
