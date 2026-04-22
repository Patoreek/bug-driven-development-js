import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Confirm Delete",
    children: <p>Are you sure you want to delete your account?</p>,
  };

  it("renders when isOpen is true", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete your account?")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it('has role="dialog"', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("has aria-modal set to true", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby pointing to the title", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();

    const titleElement = document.getElementById(labelledBy!);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("Confirm Delete");
  });

  it("closes when Escape key is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal {...defaultProps} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus within the modal", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByText("X");
    const cancelButton = screen.getByText("Cancel");
    const confirmButton = screen.getByText("Confirm");

    // Tab through all focusable elements
    // Focus should cycle within the modal
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    await user.tab();
    expect(document.activeElement).toBe(cancelButton);

    await user.tab();
    expect(document.activeElement).toBe(confirmButton);

    // After the last focusable element, focus should wrap to the first
    await user.tab();
    expect(document.activeElement).toBe(closeButton);
  });

  it("traps focus in reverse with Shift+Tab", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByText("X");
    const confirmButton = screen.getByText("Confirm");

    // Start at the first focusable element
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Shift+Tab should wrap to the last focusable element
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(confirmButton);
  });

  it("moves focus into the modal when it opens", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    // Focus should be within the dialog
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
