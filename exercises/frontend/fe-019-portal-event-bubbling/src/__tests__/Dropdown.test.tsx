import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown, Toolbar, type DropdownOption } from "../Dropdown";

const options: DropdownOption[] = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete" },
];

describe("Dropdown", () => {
  it("renders the trigger button", () => {
    render(
      <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
    );
    expect(screen.getByTestId("dropdown-trigger")).toHaveTextContent("Actions");
  });

  it("opens the dropdown menu on click", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
    );

    await user.click(screen.getByTestId("dropdown-trigger"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onSelect when an option is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Dropdown label="Actions" options={options} onSelect={onSelect} />
    );

    await user.click(screen.getByTestId("dropdown-trigger"));
    await user.click(screen.getByTestId("option-edit"));

    expect(onSelect).toHaveBeenCalledWith({ id: "edit", label: "Edit" });
  });

  it("closes the dropdown after selecting an option", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
    );

    await user.click(screen.getByTestId("dropdown-trigger"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();

    await user.click(screen.getByTestId("option-duplicate"));
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("renders the dropdown menu in a portal outside the toolbar DOM", async () => {
    const user = userEvent.setup();
    render(
      <Toolbar onToolbarClick={vi.fn()}>
        <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
      </Toolbar>
    );

    await user.click(screen.getByTestId("dropdown-trigger"));

    const toolbar = screen.getByTestId("toolbar");
    const menu = screen.getByTestId("dropdown-menu");

    // The menu should NOT be a DOM child of the toolbar
    expect(toolbar.contains(menu)).toBe(false);
  });
});

describe("Dropdown inside Toolbar — portal event bubbling", () => {
  it("does NOT trigger toolbar onClick when a dropdown option is clicked", async () => {
    const onToolbarClick = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <Toolbar onToolbarClick={onToolbarClick}>
        <Dropdown label="Actions" options={options} onSelect={onSelect} />
      </Toolbar>
    );

    // Open the dropdown
    await user.click(screen.getByTestId("dropdown-trigger"));

    // Reset the mock since clicking the trigger also clicks the toolbar
    onToolbarClick.mockClear();

    // Click a dropdown option
    await user.click(screen.getByTestId("option-delete"));

    // The dropdown's onSelect should have been called
    expect(onSelect).toHaveBeenCalledWith({ id: "delete", label: "Delete" });

    // But the toolbar's onClick should NOT have been called
    // (Without fix, portal events bubble through the React tree to the toolbar)
    expect(onToolbarClick).not.toHaveBeenCalled();
  });

  it("does NOT trigger toolbar onClick when clicking inside the dropdown menu", async () => {
    const onToolbarClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Toolbar onToolbarClick={onToolbarClick}>
        <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
      </Toolbar>
    );

    await user.click(screen.getByTestId("dropdown-trigger"));
    onToolbarClick.mockClear();

    // Click on the menu container itself (not an option)
    await user.click(screen.getByTestId("dropdown-menu"));

    expect(onToolbarClick).not.toHaveBeenCalled();
  });

  it("still allows toolbar clicks on other elements", async () => {
    const onToolbarClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Toolbar onToolbarClick={onToolbarClick}>
        <button data-testid="other-button">Other</button>
        <Dropdown label="Actions" options={options} onSelect={vi.fn()} />
      </Toolbar>
    );

    await user.click(screen.getByTestId("other-button"));
    expect(onToolbarClick).toHaveBeenCalledTimes(1);
  });
});
